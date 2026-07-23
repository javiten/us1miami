"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { packages } from "@/lib/db/schema"
import { requirePermission } from "@/lib/session"
import { recordAudit } from "@/lib/audit"
import { canTransition, statusLabel } from "@/lib/constants"

export type PackageActionResult = { ok?: boolean; error?: string }

function revalidatePackage(id: number) {
  revalidatePath("/admin/paquetes")
  revalidatePath(`/admin/paquetes/${id}`)
  revalidatePath("/admin")
}

/**
 * Move a package to a new status. Only transitions declared in
 * VALID_TRANSITIONS are allowed; every change is recorded in the audit log
 * with the old status, new status, admin, timestamp and an optional note.
 */
export async function transitionPackageStatus(input: {
  packageId: number
  toStatus: string
  note?: string
}): Promise<PackageActionResult> {
  const admin = await requirePermission("packages.transition")
  const packageId = Number(input.packageId)
  const toStatus = String(input.toStatus ?? "")
  if (!Number.isFinite(packageId) || !toStatus) return { error: "Datos inválidos." }

  const [pkg] = await db
    .select({ status: packages.status, wrNumber: packages.wrNumber })
    .from(packages)
    .where(eq(packages.id, packageId))
    .limit(1)
  if (!pkg) return { error: "Paquete no encontrado." }

  const from = pkg.status
  if (from === toStatus) return { error: "El paquete ya está en ese estado." }
  if (!canTransition(from, toStatus)) {
    return { error: `Transición no permitida: ${statusLabel(from)} → ${statusLabel(toStatus)}.` }
  }

  await db.update(packages).set({ status: toStatus, updatedAt: new Date() }).where(eq(packages.id, packageId))

  await recordAudit({
    actorUserId: admin.id,
    actorName: admin.name,
    action: "PACKAGE_STATUS_CHANGED",
    entityType: "package",
    entityId: packageId,
    metadata: {
      wrNumber: pkg.wrNumber,
      from,
      to: toStatus,
      fromLabel: statusLabel(from),
      toLabel: statusLabel(toStatus),
      note: input.note?.trim() || null,
    },
  })

  revalidatePackage(packageId)
  return { ok: true }
}

// Fields an authorized admin may edit. WR number is intentionally excluded.
const EDITABLE = [
  "trackingNumber",
  "carrier",
  "description",
  "quantity",
  "weightLb",
  "lengthIn",
  "widthIn",
  "heightIn",
  "warehouseLocation",
  "notes",
] as const

type EditableKey = (typeof EDITABLE)[number]
const NUMERIC_KEYS: EditableKey[] = ["quantity", "weightLb", "lengthIn", "widthIn", "heightIn"]

/** Edit package data (never the WR number). Records a diff in the audit log. */
export async function editPackage(
  input: { packageId: number } & Partial<Record<EditableKey, string>>,
): Promise<PackageActionResult> {
  const admin = await requirePermission("packages.edit")
  const packageId = Number(input.packageId)
  if (!Number.isFinite(packageId)) return { error: "Paquete inválido." }

  const [pkg] = await db.select().from(packages).where(eq(packages.id, packageId)).limit(1)
  if (!pkg) return { error: "Paquete no encontrado." }

  const patch: Record<string, unknown> = { updatedAt: new Date() }
  const changes: Record<string, { from: unknown; to: unknown }> = {}

  for (const key of EDITABLE) {
    const raw = input[key]
    if (raw === undefined) continue
    const trimmed = raw.trim()
    let next: unknown = trimmed === "" ? null : trimmed
    if (next !== null && NUMERIC_KEYS.includes(key)) {
      const n = Number(trimmed)
      if (!Number.isFinite(n) || n < 0) return { error: `Valor numérico inválido en ${key}.` }
      next = key === "quantity" ? Math.round(n) : String(n)
    }
    const prev = (pkg as Record<string, unknown>)[key] ?? null
    if (String(prev ?? "") !== String(next ?? "")) {
      patch[key] = next
      changes[key] = { from: prev, to: next }
    }
  }

  if (Object.keys(changes).length === 0) return { ok: true }

  await db.update(packages).set(patch).where(eq(packages.id, packageId))

  await recordAudit({
    actorUserId: admin.id,
    actorName: admin.name,
    action: "PACKAGE_EDITED",
    entityType: "package",
    entityId: packageId,
    metadata: { wrNumber: pkg.wrNumber, changes },
  })

  revalidatePackage(packageId)
  return { ok: true }
}

/**
 * Add / update internal notes only. Available to Customer Support, who cannot
 * modify warehouse data or shipment status.
 */
export async function updatePackageNotes(input: {
  packageId: number
  notes: string
}): Promise<PackageActionResult> {
  const admin = await requirePermission("packages.notes")
  const packageId = Number(input.packageId)
  if (!Number.isFinite(packageId)) return { error: "Paquete inválido." }

  const [pkg] = await db
    .select({ notes: packages.notes, wrNumber: packages.wrNumber })
    .from(packages)
    .where(eq(packages.id, packageId))
    .limit(1)
  if (!pkg) return { error: "Paquete no encontrado." }

  const next = input.notes.trim() || null
  await db.update(packages).set({ notes: next, updatedAt: new Date() }).where(eq(packages.id, packageId))

  await recordAudit({
    actorUserId: admin.id,
    actorName: admin.name,
    action: "PACKAGE_NOTE_UPDATED",
    entityType: "package",
    entityId: packageId,
    metadata: { wrNumber: pkg.wrNumber, from: pkg.notes ?? null, to: next },
  })

  revalidatePackage(packageId)
  return { ok: true }
}
