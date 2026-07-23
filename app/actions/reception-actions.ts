"use server"

import { and, eq, ilike, or, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { packages, prealerts, user as userTable, customerProfile } from "@/lib/db/schema"
import { requirePermission } from "@/lib/session"
import { recordAudit } from "@/lib/audit"
import { nextCounter } from "@/lib/counters"

export type ReceptionState = { ok?: boolean; error?: string; wrNumber?: string; packageId?: number }

/** Search customers by name, email, or box number for the reception wizard. */
export async function searchCustomers(query: string) {
  await requirePermission("warehouse.receive")
  const q = query.trim()
  if (q.length < 2) return []

  const rows = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      boxNumber: userTable.boxNumber,
    })
    .from(userTable)
    .where(
      and(
        eq(userTable.role, "CUSTOMER"),
        or(
          ilike(userTable.name, `%${q}%`),
          ilike(userTable.email, `%${q}%`),
          ilike(sql`coalesce(${userTable.boxNumber}, '')`, `%${q}%`),
        ),
      ),
    )
    .limit(8)

  return rows
}

/** Return open prealerts for a customer so the operator can match a package. */
export async function getCustomerPrealerts(userId: string) {
  await requirePermission("warehouse.receive")
  return db
    .select()
    .from(prealerts)
    .where(and(eq(prealerts.userId, userId), eq(prealerts.status, "PENDING")))
    .orderBy(prealerts.createdAt)
}

type ReceivePayload = {
  userId: string
  trackingNumber?: string
  carrier?: string
  store?: string
  description?: string
  declaredValue?: number
  weightLb: number
  lengthIn?: number
  widthIn?: number
  heightIn?: number
  warehouseLocation?: string
  notes?: string
  photos: string[]
  prealertId?: number
  workstation?: string
}

/** Finalize a warehouse reception: assign WR number, box, store photos, update prealert. */
export async function receivePackage(payload: ReceivePayload): Promise<ReceptionState> {
  const admin = await requirePermission("warehouse.receive")

  if (!payload.userId) return { error: "Seleccioná un cliente." }
  if (!payload.weightLb || payload.weightLb <= 0) return { error: "Ingresá un peso válido." }
  if (!payload.photos || payload.photos.length === 0) {
    return { error: "Tomá al menos una foto del paquete." }
  }

  // Ensure the customer has a box number; assign one if missing.
  const [customer] = await db
    .select({ id: userTable.id, name: userTable.name, boxNumber: userTable.boxNumber })
    .from(userTable)
    .where(eq(userTable.id, payload.userId))
    .limit(1)

  if (!customer) return { error: "Cliente no encontrado." }

  let boxNumber = customer.boxNumber
  if (!boxNumber) {
    const n = await nextCounter("box")
    boxNumber = `US1-${n}`
    await db.update(userTable).set({ boxNumber, updatedAt: new Date() }).where(eq(userTable.id, customer.id))
  }

  const wrSeq = await nextCounter("wr")
  const wrNumber = `WR-${wrSeq}`

  const [pkg] = await db
    .insert(packages)
    .values({
      userId: payload.userId,
      boxNumber,
      status: "IN_WAREHOUSE",
      trackingNumber: payload.trackingNumber || null,
      carrier: payload.carrier || null,
      store: payload.store || null,
      description: payload.description || null,
      declaredValue: payload.declaredValue != null ? String(payload.declaredValue) : null,
      weightLb: String(payload.weightLb),
      lengthIn: payload.lengthIn != null ? String(payload.lengthIn) : null,
      widthIn: payload.widthIn != null ? String(payload.widthIn) : null,
      heightIn: payload.heightIn != null ? String(payload.heightIn) : null,
      wrNumber,
      warehouseLocation: payload.warehouseLocation || null,
      photos: payload.photos,
      notes: payload.notes || null,
      receivedByUserId: admin.id,
      receivedByName: admin.name,
      workstation: payload.workstation || null,
      receivedAt: new Date(),
    })
    .returning({ id: packages.id })

  if (payload.prealertId) {
    await db
      .update(prealerts)
      .set({ status: "MATCHED", matchedPackageId: pkg.id })
      .where(and(eq(prealerts.id, payload.prealertId), eq(prealerts.userId, payload.userId)))
  }

  await recordAudit({
    actorUserId: admin.id,
    actorName: admin.name,
    action: "PACKAGE_RECEIVED",
    entityType: "package",
    entityId: String(pkg.id),
    metadata: { wrNumber, boxNumber, weightLb: payload.weightLb, workstation: payload.workstation },
  })

  return { ok: true, wrNumber, packageId: pkg.id }
}

/** Record that a WR label was printed or reprinted, for the audit trail. */
export async function logLabelPrint(wrNumber: string, mode: "print" | "reprint" | "pdf" = "print") {
  const admin = await requirePermission("warehouse.records")
  await recordAudit({
    actorUserId: admin.id,
    actorName: admin.name,
    action: mode === "reprint" ? "LABEL_REPRINTED" : mode === "pdf" ? "LABEL_PDF_EXPORTED" : "LABEL_PRINTED",
    entityType: "package",
    entityId: wrNumber,
    metadata: { wrNumber, mode },
  })
  return { ok: true }
}

/** Fetch a finalized package with customer info for the label / receipt screen. */
export async function getReceptionResult(packageId: number) {
  await requirePermission("warehouse.receive")
  const [row] = await db
    .select({
      pkg: packages,
      customerName: userTable.name,
      firstName: customerProfile.firstName,
      lastName: customerProfile.lastName,
    })
    .from(packages)
    .leftJoin(userTable, eq(userTable.id, packages.userId))
    .leftJoin(customerProfile, eq(customerProfile.userId, packages.userId))
    .where(eq(packages.id, packageId))
    .limit(1)
  return row ?? null
}
