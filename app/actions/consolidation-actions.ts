"use server"

import { revalidatePath } from "next/cache"
import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { consolidations, masterConsolidations, packages, user as userTable, invoices } from "@/lib/db/schema"
import { requirePermission } from "@/lib/session"
import { recordAudit } from "@/lib/audit"
import { nextCounter } from "@/lib/counters"
import { computeCwrPricing } from "@/lib/pricing"
import { INVOICE_DUE_DAYS } from "@/lib/invoices"
import type { ScanResolveResult, ScanUnit } from "@/components/admin/scanner/scan-console"

const DASH = "\u2014"

function normCode(code: string): string {
  return code.trim().toUpperCase()
}

function pkgUnit(p: {
  id: number
  wrNumber: string | null
  customerName: string | null
  boxNumber: string | null
  weightLb: string | null
  quantity: number | null
  description: string | null
}): ScanUnit {
  const pieces = p.quantity ?? 1
  return {
    key: `wr:${p.id}`,
    code: p.wrNumber ?? `#${p.id}`,
    title: p.wrNumber ?? `#${p.id}`,
    subtitle: [p.customerName ?? DASH, p.boxNumber].filter(Boolean).join(" · "),
    meta: p.weightLb ? `${p.weightLb} lb` : `${pieces} pz`,
    state: "pending",
  }
}

// ==========================================================================
// 1. QUICK WR CONSOLIDATION  → CWR
// ==========================================================================

async function eligibleWrForCustomer(userId: string) {
  return db
    .select({
      id: packages.id,
      wrNumber: packages.wrNumber,
      customerName: userTable.name,
      boxNumber: packages.boxNumber,
      weightLb: packages.weightLb,
      quantity: packages.quantity,
      description: packages.description,
    })
    .from(packages)
    .leftJoin(userTable, eq(userTable.id, packages.userId))
    .where(
      and(
        eq(packages.userId, userId),
        inArray(packages.status, ["RECEIVED", "PROCESSED"]),
        isNull(packages.consolidationId),
      ),
    )
    .orderBy(packages.createdAt)
}

/** Scan a WR while building a CWR. Locks to the first customer scanned. */
export async function scanWrForConsolidation(
  code: string,
  scannedKeys: string[],
): Promise<ScanResolveResult> {
  await requirePermission("consolidations.manage")
  const wr = normCode(code)

  const [pkg] = await db
    .select({
      id: packages.id,
      userId: packages.userId,
      status: packages.status,
      wrNumber: packages.wrNumber,
      consolidationId: packages.consolidationId,
      customerName: userTable.name,
      boxNumber: packages.boxNumber,
      weightLb: packages.weightLb,
      quantity: packages.quantity,
      description: packages.description,
    })
    .from(packages)
    .leftJoin(userTable, eq(userTable.id, packages.userId))
    .where(sql`upper(${packages.wrNumber}) = ${wr}`)
    .limit(1)

  if (!pkg) return { error: `WR no encontrado: ${code}` }
  if (pkg.consolidationId || pkg.status === "CONSOLIDATED_IN_CWR")
    return { error: `${pkg.wrNumber} ya está consolidado.` }
  if (pkg.status === "HELD") return { error: `${pkg.wrNumber} está retenido y no puede consolidarse.` }
  if (!["RECEIVED", "PROCESSED"].includes(pkg.status))
    return { error: `${pkg.wrNumber} no está disponible para consolidar.` }

  // Enforce single customer: match the already-scanned WRs' owner.
  if (scannedKeys.length > 0) {
    const firstId = Number(scannedKeys[0].replace("wr:", ""))
    const [first] = await db
      .select({ userId: packages.userId })
      .from(packages)
      .where(eq(packages.id, firstId))
      .limit(1)
    if (first && first.userId !== pkg.userId)
      return { error: `${pkg.wrNumber} pertenece a otro cliente.` }
  }

  const pool = (await eligibleWrForCustomer(pkg.userId)).map(pkgUnit)
  return {
    ok: true,
    unit: pkgUnit(pkg),
    pool,
    context: { label: "Cliente", value: pkg.customerName ?? DASH, hint: pkg.boxNumber ?? undefined },
  }
}

export type CreateCwrResult = { ok?: boolean; error?: string; cwrNumber?: string; cwrId?: number }

/** Finalize a CWR from scanned WRs in a single transaction. */
export async function createCwr(input: {
  unitKeys: string[]
  pieces?: number
  weightLb?: number
  lengthIn?: number
  widthIn?: number
  heightIn?: number
  description?: string
  warehouseLocation?: string
  notes?: string
  photos?: string[]
}): Promise<CreateCwrResult> {
  const admin = await requirePermission("consolidations.manage")
  const ids = input.unitKeys.map((k) => Number(k.replace("wr:", ""))).filter(Number.isFinite)
  if (ids.length < 2) return { error: "Consolidá al menos 2 WR." }
  if (!input.weightLb || input.weightLb <= 0) return { error: "Ingresá el peso final." }

  try {
    return await db.transaction(async (tx) => {
      const rows = await tx
        .select({
          id: packages.id,
          userId: packages.userId,
          status: packages.status,
          wrNumber: packages.wrNumber,
          consolidationId: packages.consolidationId,
        })
        .from(packages)
        .where(inArray(packages.id, ids))

      if (rows.length !== ids.length) return { error: "Algún WR ya no existe." }
      const userId = rows[0].userId
      for (const r of rows) {
        if (r.userId !== userId) return { error: "Todos los WR deben ser del mismo cliente." }
        if (r.consolidationId || r.status === "CONSOLIDATED_IN_CWR")
          return { error: `${r.wrNumber} ya fue consolidado por otra operación.` }
        if (!["RECEIVED", "PROCESSED"].includes(r.status))
          return { error: `${r.wrNumber} no está disponible.` }
      }

      const seq = await nextCounter("cwr")
      const cwrNumber = `CWR-${seq}`

      // Auto-price the consolidation from its final billable weight. The CWR is
      // created PENDING_PAYMENT and stays operationally blocked until the linked
      // invoice is PAID (or, for >20 kg, until the review invoice is resolved).
      const pricing = computeCwrPricing({
        weightLb: input.weightLb ?? 0,
        lengthIn: input.lengthIn ?? null,
        widthIn: input.widthIn ?? null,
        heightIn: input.heightIn ?? null,
      })

      const [cwr] = await tx
        .insert(consolidations)
        .values({
          userId,
          cwrNumber,
          status: "PENDING_PAYMENT",
          packageIds: ids,
          pieces: input.pieces ?? ids.length,
          weightLb: String(input.weightLb),
          lengthIn: input.lengthIn != null ? String(input.lengthIn) : null,
          widthIn: input.widthIn != null ? String(input.widthIn) : null,
          heightIn: input.heightIn != null ? String(input.heightIn) : null,
          description: input.description || null,
          warehouseLocation: input.warehouseLocation || null,
          photos: input.photos ?? [],
          operatorId: admin.id,
          operatorName: admin.name,
          completedAt: new Date(),
        })
        .returning({ id: consolidations.id })

      await tx
        .update(packages)
        .set({ status: "CONSOLIDATED_IN_CWR", cwrNumber, consolidationId: cwr.id, updatedAt: new Date() })
        .where(inArray(packages.id, ids))

      // Exactly one invoice per consolidation (unique constraint on
      // consolidationId backstops any duplicate attempt).
      const invSeq = await nextCounter("inv")
      const invoiceNumber = `INV-${invSeq}`
      const dueDate = new Date(Date.now() + INVOICE_DUE_DAYS * 24 * 60 * 60 * 1000)
      await tx.insert(invoices).values({
        invoiceNumber,
        consolidationId: cwr.id,
        userId,
        status: pricing.requiresReview ? "REQUIRES_REVIEW" : "OPEN",
        actualWeightKg: String(pricing.actualWeightKg),
        volumetricWeightKg: String(pricing.volumetricWeightKg),
        billableWeightKg: String(pricing.billableWeightKg),
        ratePerKg: pricing.ratePerKg != null ? String(pricing.ratePerKg) : null,
        subtotal: pricing.subtotal != null ? String(pricing.subtotal) : null,
        dueDate,
      })

      await recordAudit({
        actorUserId: admin.id,
        actorName: admin.name,
        action: "CWR_CREATED",
        entityType: "consolidation",
        entityId: cwrNumber,
        metadata: { cwrNumber, packageIds: ids, weightLb: input.weightLb, userId, invoiceNumber },
      })
      await recordAudit({
        actorUserId: admin.id,
        actorName: admin.name,
        action: "INVOICE_CREATED",
        entityType: "invoice",
        entityId: invoiceNumber,
        metadata: {
          invoiceNumber,
          cwrNumber,
          billableWeightKg: pricing.billableWeightKg,
          ratePerKg: pricing.ratePerKg,
          subtotal: pricing.subtotal,
          requiresReview: pricing.requiresReview,
        },
      })

      revalidatePath("/admin/consolidar-wr")
      revalidatePath("/admin/paquetes")
      revalidatePath("/admin/invoices")
      revalidatePath("/admin")
      return { ok: true, cwrNumber, cwrId: cwr.id }
    })
  } catch {
    return { error: "No se pudo crear el CWR. Reintentá." }
  }
}

// ==========================================================================
// 1b. CUSTOMER CONSOLIDATION REQUESTS  (admin queue)
// ==========================================================================

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

/** Revert packages to an available warehouse state and detach them from a CWR. */
async function releasePackages(tx: Tx, ids: number[]) {
  if (!ids.length) return
  await tx
    .update(packages)
    .set({ status: "PROCESSED", consolidationId: null, cwrNumber: null, updatedAt: new Date() })
    .where(inArray(packages.id, ids))
}

function revalidateRequests() {
  revalidatePath("/admin/solicitudes")
  revalidatePath("/admin/paquetes")
  revalidatePath("/admin/invoices")
  revalidatePath("/admin")
  revalidatePath("/panel/consolidaciones")
  revalidatePath("/panel/paquetes")
}

/** Accept a customer request: weigh it, turn it into a priced CWR + invoice. */
export async function acceptConsolidationRequest(input: {
  id: number
  pieces?: number
  weightLb?: number
  lengthIn?: number
  widthIn?: number
  heightIn?: number
  description?: string
  warehouseLocation?: string
  notes?: string
}): Promise<CreateCwrResult> {
  const admin = await requirePermission("consolidations.manage")
  if (!input.weightLb || input.weightLb <= 0) return { error: "Ingresá el peso final." }

  try {
    return await db.transaction(async (tx) => {
      const [cons] = await tx.select().from(consolidations).where(eq(consolidations.id, input.id)).limit(1)
      if (!cons) return { error: "Solicitud no encontrada." }
      if (cons.status !== "REQUESTED")
        return { error: "Solo se pueden aceptar solicitudes pendientes. Resolvé la baja primero si corresponde." }

      const ids = (cons.packageIds as number[]) ?? []
      if (ids.length < 1) return { error: "La solicitud no tiene paquetes." }

      const rows = await tx.select({ id: packages.id, status: packages.status }).from(packages).where(inArray(packages.id, ids))
      if (rows.length !== ids.length) return { error: "Algún paquete ya no existe." }

      const seq = await nextCounter("cwr")
      const cwrNumber = `CWR-${seq}`

      const pricing = computeCwrPricing({
        weightLb: input.weightLb ?? 0,
        lengthIn: input.lengthIn ?? null,
        widthIn: input.widthIn ?? null,
        heightIn: input.heightIn ?? null,
      })

      await tx
        .update(consolidations)
        .set({
          cwrNumber,
          status: "PENDING_PAYMENT",
          pieces: input.pieces ?? ids.length,
          weightLb: String(input.weightLb),
          lengthIn: input.lengthIn != null ? String(input.lengthIn) : null,
          widthIn: input.widthIn != null ? String(input.widthIn) : null,
          heightIn: input.heightIn != null ? String(input.heightIn) : null,
          description: input.description || cons.description,
          warehouseLocation: input.warehouseLocation || null,
          notes: input.notes || cons.notes,
          operatorId: admin.id,
          operatorName: admin.name,
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(consolidations.id, input.id))

      await tx
        .update(packages)
        .set({ status: "CONSOLIDATED_IN_CWR", cwrNumber, consolidationId: input.id, updatedAt: new Date() })
        .where(inArray(packages.id, ids))

      const invSeq = await nextCounter("inv")
      const invoiceNumber = `INV-${invSeq}`
      const dueDate = new Date(Date.now() + INVOICE_DUE_DAYS * 24 * 60 * 60 * 1000)
      await tx.insert(invoices).values({
        invoiceNumber,
        consolidationId: input.id,
        userId: cons.userId,
        status: pricing.requiresReview ? "REQUIRES_REVIEW" : "OPEN",
        actualWeightKg: String(pricing.actualWeightKg),
        volumetricWeightKg: String(pricing.volumetricWeightKg),
        billableWeightKg: String(pricing.billableWeightKg),
        ratePerKg: pricing.ratePerKg != null ? String(pricing.ratePerKg) : null,
        subtotal: pricing.subtotal != null ? String(pricing.subtotal) : null,
        dueDate,
      })

      await recordAudit({
        actorUserId: admin.id,
        actorName: admin.name,
        action: "CWR_CREATED",
        entityType: "consolidation",
        entityId: cwrNumber,
        metadata: { cwrNumber, packageIds: ids, weightLb: input.weightLb, userId: cons.userId, invoiceNumber, fromRequest: input.id },
      })
      await recordAudit({
        actorUserId: admin.id,
        actorName: admin.name,
        action: "INVOICE_CREATED",
        entityType: "invoice",
        entityId: invoiceNumber,
        metadata: {
          invoiceNumber,
          cwrNumber,
          billableWeightKg: pricing.billableWeightKg,
          ratePerKg: pricing.ratePerKg,
          subtotal: pricing.subtotal,
          requiresReview: pricing.requiresReview,
        },
      })

      revalidateRequests()
      return { ok: true, cwrNumber, cwrId: input.id }
    })
  } catch {
    return { error: "No se pudo aceptar la solicitud. Reintentá." }
  }
}

/** Add and/or remove packages on a still-pending consolidation request. */
export async function editConsolidationRequest(input: {
  id: number
  addIds?: number[]
  removeIds?: number[]
}): Promise<{ ok?: boolean; error?: string }> {
  const admin = await requirePermission("consolidations.manage")
  const addIds = (input.addIds ?? []).filter(Number.isFinite)
  const removeIds = (input.removeIds ?? []).filter(Number.isFinite)
  if (!addIds.length && !removeIds.length) return { error: "No hay cambios para aplicar." }

  try {
    return await db.transaction(async (tx) => {
      const [cons] = await tx.select().from(consolidations).where(eq(consolidations.id, input.id)).limit(1)
      if (!cons) return { error: "Solicitud no encontrada." }
      if (cons.status !== "REQUESTED") return { error: "Solo se pueden editar solicitudes pendientes." }

      const current = new Set((cons.packageIds as number[]) ?? [])

      // Remove: must belong to this request.
      const toRemove = removeIds.filter((id) => current.has(id))
      if (toRemove.length) {
        await releasePackages(tx, toRemove)
        toRemove.forEach((id) => current.delete(id))
      }

      // Add: must belong to same customer, available, and unattached.
      if (addIds.length) {
        const rows = await tx
          .select({ id: packages.id, userId: packages.userId, status: packages.status, consolidationId: packages.consolidationId })
          .from(packages)
          .where(inArray(packages.id, addIds))
        for (const r of rows) {
          if (r.userId !== cons.userId) return { error: "Un paquete pertenece a otro cliente." }
          if (r.consolidationId != null || !["RECEIVED", "PROCESSED"].includes(r.status))
            return { error: "Un paquete no está disponible para sumar." }
        }
        await tx
          .update(packages)
          .set({ status: "CONSOLIDATING", consolidationId: input.id, updatedAt: new Date() })
          .where(inArray(packages.id, addIds))
        addIds.forEach((id) => current.add(id))
      }

      const nextIds = [...current]
      if (nextIds.length < 1) return { error: "La solicitud debe tener al menos un paquete." }

      await tx
        .update(consolidations)
        .set({ packageIds: nextIds, updatedAt: new Date() })
        .where(eq(consolidations.id, input.id))

      await recordAudit({
        actorUserId: admin.id,
        actorName: admin.name,
        action: "CONSOLIDATION_EDITED",
        entityType: "consolidation",
        entityId: input.id,
        metadata: { added: addIds, removed: toRemove, packageIds: nextIds },
      })

      revalidateRequests()
      return { ok: true }
    })
  } catch {
    return { error: "No se pudieron aplicar los cambios. Reintentá." }
  }
}

/** Cancel an open request (admin-initiated) and free its packages. */
export async function cancelConsolidationRequest(id: number): Promise<{ ok?: boolean; error?: string }> {
  const admin = await requirePermission("consolidations.manage")
  try {
    return await db.transaction(async (tx) => {
      const [cons] = await tx.select().from(consolidations).where(eq(consolidations.id, id)).limit(1)
      if (!cons) return { error: "Solicitud no encontrada." }
      if (!["REQUESTED", "UNDO_REQUESTED"].includes(cons.status))
        return { error: "Esta solicitud ya no se puede cancelar." }

      await releasePackages(tx, (cons.packageIds as number[]) ?? [])
      await tx.update(consolidations).set({ status: "CANCELLED", updatedAt: new Date() }).where(eq(consolidations.id, id))

      await recordAudit({
        actorUserId: admin.id,
        actorName: admin.name,
        action: "CONSOLIDATION_CANCELLED",
        entityType: "consolidation",
        entityId: id,
        metadata: { packageIds: cons.packageIds, by: "admin" },
      })

      revalidateRequests()
      return { ok: true }
    })
  } catch {
    return { error: "No se pudo cancelar la solicitud. Reintentá." }
  }
}

/** Approve a customer's undo request: cancel the consolidation, free packages. */
export async function approveUndoConsolidation(id: number): Promise<{ ok?: boolean; error?: string }> {
  const admin = await requirePermission("consolidations.manage")
  try {
    return await db.transaction(async (tx) => {
      const [cons] = await tx.select().from(consolidations).where(eq(consolidations.id, id)).limit(1)
      if (!cons) return { error: "Solicitud no encontrada." }
      if (cons.status !== "UNDO_REQUESTED") return { error: "No hay una baja pendiente para aprobar." }

      await releasePackages(tx, (cons.packageIds as number[]) ?? [])
      await tx.update(consolidations).set({ status: "CANCELLED", updatedAt: new Date() }).where(eq(consolidations.id, id))

      await recordAudit({
        actorUserId: admin.id,
        actorName: admin.name,
        action: "CONSOLIDATION_UNDO_APPROVED",
        entityType: "consolidation",
        entityId: id,
        metadata: { packageIds: cons.packageIds },
      })

      revalidateRequests()
      return { ok: true }
    })
  } catch {
    return { error: "No se pudo aprobar la baja. Reintentá." }
  }
}

/** Reject a customer's undo request: keep the consolidation as requested. */
export async function rejectUndoConsolidation(id: number): Promise<{ ok?: boolean; error?: string }> {
  const admin = await requirePermission("consolidations.manage")
  try {
    const [cons] = await db.select().from(consolidations).where(eq(consolidations.id, id)).limit(1)
    if (!cons) return { error: "Solicitud no encontrada." }
    if (cons.status !== "UNDO_REQUESTED") return { error: "No hay una baja pendiente para rechazar." }

    await db.update(consolidations).set({ status: "REQUESTED", updatedAt: new Date() }).where(eq(consolidations.id, id))
    await recordAudit({
      actorUserId: admin.id,
      actorName: admin.name,
      action: "CONSOLIDATION_UNDO_REJECTED",
      entityType: "consolidation",
      entityId: id,
    })
    revalidateRequests()
    return { ok: true }
  } catch {
    return { error: "No se pudo rechazar la baja. Reintentá." }
  }
}

// ==========================================================================
// 2. MASTER CONSOLIDATION  → MC
// ==========================================================================

async function eligibleMasterPool(): Promise<ScanUnit[]> {
  const cwrs = await db
    .select({
      id: consolidations.id,
      cwrNumber: consolidations.cwrNumber,
      pieces: consolidations.pieces,
      weightLb: consolidations.weightLb,
      customerName: userTable.name,
    })
    .from(consolidations)
    .leftJoin(userTable, eq(userTable.id, consolidations.userId))
    .where(and(eq(consolidations.status, "READY_TO_SHIP"), isNull(consolidations.masterId)))
    .orderBy(desc(consolidations.createdAt))

  const wrs = await db
    .select({
      id: packages.id,
      wrNumber: packages.wrNumber,
      customerName: userTable.name,
      boxNumber: packages.boxNumber,
      weightLb: packages.weightLb,
      quantity: packages.quantity,
      description: packages.description,
    })
    .from(packages)
    .leftJoin(userTable, eq(userTable.id, packages.userId))
    .where(
      and(
        inArray(packages.status, ["PROCESSED", "READY_TO_SHIP"]),
        isNull(packages.consolidationId),
      ),
    )
    .orderBy(desc(packages.createdAt))
    .limit(100)

  return [
    ...cwrs.map((c) => ({
      key: `cwr:${c.id}`,
      code: c.cwrNumber ?? `#${c.id}`,
      title: c.cwrNumber ?? `#${c.id}`,
      subtitle: `${c.customerName ?? DASH} · CWR`,
      meta: c.weightLb ? `${c.weightLb} lb` : `${c.pieces ?? 0} pz`,
      state: "pending" as const,
    })),
    ...wrs.map(pkgUnit),
  ]
}

/** Scan a CWR or eligible WR into a master consolidation. */
export async function scanUnitForMaster(
  code: string,
  _scannedKeys: string[],
): Promise<ScanResolveResult> {
  await requirePermission("master.manage")
  const c = normCode(code)

  // Try CWR first.
  const [cwr] = await db
    .select({
      id: consolidations.id,
      cwrNumber: consolidations.cwrNumber,
      status: consolidations.status,
      masterId: consolidations.masterId,
      pieces: consolidations.pieces,
      weightLb: consolidations.weightLb,
      customerName: userTable.name,
    })
    .from(consolidations)
    .leftJoin(userTable, eq(userTable.id, consolidations.userId))
    .where(sql`upper(${consolidations.cwrNumber}) = ${c}`)
    .limit(1)

  if (cwr) {
    if (cwr.masterId) return { error: `${cwr.cwrNumber} ya está en una carga maestra.` }
    if (cwr.status === "PENDING_PAYMENT")
      return { error: `${cwr.cwrNumber} tiene el envío impago (PAYMENT_REQUIRED). El cliente debe pagar antes de cargarlo.` }
    if (cwr.status !== "READY_TO_SHIP") return { error: `${cwr.cwrNumber} no está listo para envío.` }
    return {
      ok: true,
      unit: {
        key: `cwr:${cwr.id}`,
        code: cwr.cwrNumber ?? c,
        title: cwr.cwrNumber ?? c,
        subtitle: `${cwr.customerName ?? DASH} · CWR`,
        meta: cwr.weightLb ? `${cwr.weightLb} lb` : `${cwr.pieces ?? 0} pz`,
        state: "scanned",
      },
      pool: await eligibleMasterPool(),
    }
  }

  // Then an individual WR.
  const [pkg] = await db
    .select({
      id: packages.id,
      wrNumber: packages.wrNumber,
      status: packages.status,
      consolidationId: packages.consolidationId,
      customerName: userTable.name,
      boxNumber: packages.boxNumber,
      weightLb: packages.weightLb,
      quantity: packages.quantity,
      description: packages.description,
    })
    .from(packages)
    .leftJoin(userTable, eq(userTable.id, packages.userId))
    .where(sql`upper(${packages.wrNumber}) = ${c}`)
    .limit(1)

  if (!pkg) return { error: `Código no encontrado: ${code}` }
  if (pkg.consolidationId) return { error: `${pkg.wrNumber} está dentro de un CWR. Escaneá el CWR.` }
  if (pkg.status === "IN_MASTER") return { error: `${pkg.wrNumber} ya está en una carga maestra.` }
  if (!["PROCESSED", "READY_TO_SHIP"].includes(pkg.status))
    return { error: `${pkg.wrNumber} no está disponible.` }

  return { ok: true, unit: { ...pkgUnit(pkg), state: "scanned" }, pool: await eligibleMasterPool() }
}

export type CreateMcResult = { ok?: boolean; error?: string; mcNumber?: string; mcId?: number }

/** Finalize a master consolidation from scanned CWR/WR units. */
export async function createMc(input: {
  unitKeys: string[]
  sealNumber?: string
  destination?: string
  service?: string
  weightLb?: number
  lengthIn?: number
  widthIn?: number
  heightIn?: number
  notes?: string
  photos?: string[]
}): Promise<CreateMcResult> {
  const admin = await requirePermission("master.manage")
  const cwrIds = input.unitKeys.filter((k) => k.startsWith("cwr:")).map((k) => Number(k.slice(4)))
  const wrIds = input.unitKeys.filter((k) => k.startsWith("wr:")).map((k) => Number(k.slice(3)))
  if (cwrIds.length + wrIds.length < 1) return { error: "Agregá al menos una unidad." }

  try {
    return await db.transaction(async (tx) => {
      const cwrRows = cwrIds.length
        ? await tx
            .select({ id: consolidations.id, userId: consolidations.userId, status: consolidations.status, masterId: consolidations.masterId, cwrNumber: consolidations.cwrNumber, pieces: consolidations.pieces })
            .from(consolidations)
            .where(inArray(consolidations.id, cwrIds))
        : []
      const wrRows = wrIds.length
        ? await tx
            .select({ id: packages.id, userId: packages.userId, status: packages.status, consolidationId: packages.consolidationId, wrNumber: packages.wrNumber, quantity: packages.quantity })
            .from(packages)
            .where(inArray(packages.id, wrIds))
        : []

      for (const c of cwrRows) {
        if (c.masterId) return { error: `${c.cwrNumber} ya pertenece a otra carga maestra.` }
        if (c.status !== "READY_TO_SHIP") return { error: `${c.cwrNumber} no está listo.` }
      }

      // Payment guard: no CWR may enter a master consolidation unless its
      // linked invoice is PAID. This backstops the READY_TO_SHIP status filter.
      if (cwrIds.length) {
        const paidRows = await tx
          .select({ consolidationId: invoices.consolidationId, status: invoices.status })
          .from(invoices)
          .where(inArray(invoices.consolidationId, cwrIds))
        const paidMap = new Map(paidRows.map((r) => [r.consolidationId, r.status]))
        for (const c of cwrRows) {
          if (paidMap.get(c.id) !== "PAID")
            return { error: `${c.cwrNumber} tiene el envío impago (PAYMENT_REQUIRED) y no puede cargarse.` }
        }
      }
      for (const w of wrRows) {
        if (w.consolidationId) return { error: `${w.wrNumber} está dentro de un CWR.` }
        if (w.status === "IN_MASTER") return { error: `${w.wrNumber} ya está en una carga maestra.` }
      }

      const customers = new Set<string>([...cwrRows.map((c) => c.userId), ...wrRows.map((w) => w.userId)])
      const pieces =
        cwrRows.reduce((s, c) => s + (c.pieces ?? 0), 0) + wrRows.reduce((s, w) => s + (w.quantity ?? 1), 0)

      const seq = await nextCounter("mc")
      const mcNumber = `MC-${seq}`

      const [mc] = await tx
        .insert(masterConsolidations)
        .values({
          mcNumber,
          status: "READY_TO_SHIP",
          cwrIds,
          packageIds: wrIds,
          customerCount: customers.size,
          pieces,
          weightLb: input.weightLb != null ? String(input.weightLb) : null,
          lengthIn: input.lengthIn != null ? String(input.lengthIn) : null,
          widthIn: input.widthIn != null ? String(input.widthIn) : null,
          heightIn: input.heightIn != null ? String(input.heightIn) : null,
          sealNumber: input.sealNumber || null,
          destination: input.destination || null,
          service: input.service || null,
          notes: input.notes || null,
          photos: input.photos ?? [],
          operatorId: admin.id,
          operatorName: admin.name,
          completedAt: new Date(),
        })
        .returning({ id: masterConsolidations.id })

      if (cwrIds.length)
        await tx
          .update(consolidations)
          .set({ status: "CONSOLIDATED_IN_MC", masterId: mc.id, updatedAt: new Date() })
          .where(inArray(consolidations.id, cwrIds))
      if (wrIds.length)
        await tx
          .update(packages)
          .set({ status: "IN_MASTER", updatedAt: new Date() })
          .where(inArray(packages.id, wrIds))

      await recordAudit({
        actorUserId: admin.id,
        actorName: admin.name,
        action: "MC_CREATED",
        entityType: "master",
        entityId: mcNumber,
        metadata: { mcNumber, cwrIds, wrIds, customers: customers.size, pieces },
      })

      revalidatePath("/admin/carga-maestra")
      revalidatePath("/admin")
      return { ok: true, mcNumber, mcId: mc.id }
    })
  } catch {
    return { error: "No se pudo crear la carga maestra. Reintentá." }
  }
}

/** Generate an MAWB number + cargo manifest reference for a master consolidation. */
export async function generateMawb(mcId: number): Promise<{ ok?: boolean; error?: string; mawbNumber?: string }> {
  const admin = await requirePermission("airwaybills.manage")
  const [mc] = await db.select().from(masterConsolidations).where(eq(masterConsolidations.id, mcId)).limit(1)
  if (!mc) return { error: "Carga maestra no encontrada." }
  if (mc.mawbNumber) return { ok: true, mawbNumber: mc.mawbNumber }

  const seq = await nextCounter("mawb")
  const mawbNumber = `MAWB-${seq}`
  await db
    .update(masterConsolidations)
    .set({ mawbNumber, status: "IN_TRANSIT", updatedAt: new Date() })
    .where(eq(masterConsolidations.id, mcId))

  // Stamp the MAWB on every package under this MC (direct + nested in CWRs).
  const cwrIds = mc.cwrIds ?? []
  const nestedIds = cwrIds.length
    ? (await db.select({ packageIds: consolidations.packageIds }).from(consolidations).where(inArray(consolidations.id, cwrIds))).flatMap(
        (r) => r.packageIds ?? [],
      )
    : []
  const allPkgIds = [...(mc.packageIds ?? []), ...nestedIds]
  if (allPkgIds.length)
    await db
      .update(packages)
      .set({ mawbNumber, status: "IN_TRANSIT", updatedAt: new Date() })
      .where(inArray(packages.id, allPkgIds))
  if (cwrIds.length)
    await db.update(consolidations).set({ status: "IN_TRANSIT", updatedAt: new Date() }).where(inArray(consolidations.id, cwrIds))

  await recordAudit({
    actorUserId: admin.id,
    actorName: admin.name,
    action: "MAWB_GENERATED",
    entityType: "master",
    entityId: mc.mcNumber ?? undefined,
    metadata: { mcNumber: mc.mcNumber, mawbNumber },
  })

  revalidatePath(`/admin/carga-maestra/${mcId}`)
  revalidatePath("/admin/carga-maestra")
  return { ok: true, mawbNumber }
}

// ==========================================================================
// 3. DECONSOLIDATE MASTER CARGO (Argentina)
// ==========================================================================

/** Complete an MC deconsolidation: mark verified units received, log incidents. */
export async function completeMcDeconsolidation(input: {
  mcId: number
  units: { key: string; state: "scanned" | "incident"; incident?: string }[]
  notes?: string
  photos?: string[]
}): Promise<{ ok?: boolean; error?: string }> {
  const admin = await requirePermission("deconsolidation.manage")
  try {
    return await db.transaction(async (tx) => {
      const [mc] = await tx.select().from(masterConsolidations).where(eq(masterConsolidations.id, input.mcId)).limit(1)
      if (!mc) return { error: "Carga maestra no encontrada." }
      if (mc.status === "DECONSOLIDATED") return { error: "Esta carga ya fue desconsolidada." }

      const expected = [...(mc.cwrIds ?? []).map((id) => `cwr:${id}`), ...(mc.packageIds ?? []).map((id) => `wr:${id}`)]
      const handled = new Set(input.units.map((u) => u.key))
      const missing = expected.filter((k) => !handled.has(k))
      if (missing.length > 0) return { error: `Faltan ${missing.length} unidad(es) por verificar.` }

      const verifiedCwr = input.units.filter((u) => u.key.startsWith("cwr:") && u.state === "scanned").map((u) => Number(u.key.slice(4)))
      const verifiedWr = input.units.filter((u) => u.key.startsWith("wr:") && u.state === "scanned").map((u) => Number(u.key.slice(3)))

      if (verifiedCwr.length) {
        await tx
          .update(consolidations)
          .set({ status: "RECEIVED_ARGENTINA", updatedAt: new Date() })
          .where(inArray(consolidations.id, verifiedCwr))

        // Cascade into the WRs that belong to the verified CWRs so their status
        // reflects that the cargo landed in Argentina. They advance again to
        // READY_FOR_DELIVERY_AR when the CWR itself is deconsolidated.
        const memberCwrs = await tx
          .select({ packageIds: consolidations.packageIds })
          .from(consolidations)
          .where(inArray(consolidations.id, verifiedCwr))
        const cwrWrIds = memberCwrs.flatMap((c) => c.packageIds ?? [])
        if (cwrWrIds.length)
          await tx
            .update(packages)
            .set({ status: "RECEIVED_ARGENTINA", updatedAt: new Date() })
            .where(inArray(packages.id, cwrWrIds))
      }
      if (verifiedWr.length)
        await tx
          .update(packages)
          .set({ status: "RECEIVED_ARGENTINA", updatedAt: new Date() })
          .where(inArray(packages.id, verifiedWr))

      await tx
        .update(masterConsolidations)
        .set({
          status: "DECONSOLIDATED",
          deconsolidatedAt: new Date(),
          deconsolidatedById: admin.id,
          deconsolidatedByName: admin.name,
          notes: input.notes || mc.notes,
          photos: input.photos?.length ? [...(mc.photos ?? []), ...input.photos] : mc.photos,
          updatedAt: new Date(),
        })
        .where(eq(masterConsolidations.id, input.mcId))

      await recordAudit({
        actorUserId: admin.id,
        actorName: admin.name,
        action: "MC_DECONSOLIDATED",
        entityType: "master",
        entityId: mc.mcNumber ?? undefined,
        metadata: {
          mcNumber: mc.mcNumber,
          verifiedCwr: verifiedCwr.length,
          verifiedWr: verifiedWr.length,
          incidents: input.units.filter((u) => u.state === "incident").map((u) => ({ key: u.key, incident: u.incident })),
        },
      })

      revalidatePath("/admin/desconsolidar-carga")
      revalidatePath("/admin/carga-maestra")
      revalidatePath("/admin")
      return { ok: true }
    })
  } catch {
    return { error: "No se pudo completar la desconsolidación. Reintentá." }
  }
}

// ==========================================================================
// 4. DECONSOLIDATE CUSTOMER CWR (Argentina delivery)
// ==========================================================================

/** Complete a CWR deconsolidation: WR become ready for delivery in Argentina. */
export async function completeCwrDeconsolidation(input: {
  cwrId: number
  units: { key: string; state: "scanned" | "incident"; incident?: string }[]
  warehouseLocation?: string
  notes?: string
  photos?: string[]
}): Promise<{ ok?: boolean; error?: string }> {
  const admin = await requirePermission("deconsolidation.manage")
  try {
    return await db.transaction(async (tx) => {
      const [cwr] = await tx.select().from(consolidations).where(eq(consolidations.id, input.cwrId)).limit(1)
      if (!cwr) return { error: "CWR no encontrado." }
      if (cwr.status === "DECONSOLIDATED") return { error: "Este CWR ya fue desconsolidado." }

      const expected = (cwr.packageIds ?? []).map((id) => `wr:${id}`)
      const handled = new Set(input.units.map((u) => u.key))
      const missing = expected.filter((k) => !handled.has(k))
      if (missing.length > 0) return { error: `Faltan ${missing.length} WR por verificar.` }

      const verifiedWr = input.units.filter((u) => u.state === "scanned").map((u) => Number(u.key.slice(3)))

      if (verifiedWr.length)
        await tx
          .update(packages)
          .set({
            status: "READY_FOR_DELIVERY_AR",
            warehouseLocation: input.warehouseLocation || sql`${packages.warehouseLocation}`,
            updatedAt: new Date(),
          })
          .where(inArray(packages.id, verifiedWr))

      await tx
        .update(consolidations)
        .set({
          status: "DECONSOLIDATED",
          deconsolidatedAt: new Date(),
          deconsolidatedById: admin.id,
          deconsolidatedByName: admin.name,
          notes: input.notes || cwr.notes,
          photos: input.photos?.length ? [...(cwr.photos ?? []), ...input.photos] : cwr.photos,
          updatedAt: new Date(),
        })
        .where(eq(consolidations.id, input.cwrId))

      await recordAudit({
        actorUserId: admin.id,
        actorName: admin.name,
        action: "CWR_DECONSOLIDATED",
        entityType: "consolidation",
        entityId: cwr.cwrNumber ?? undefined,
        metadata: {
          cwrNumber: cwr.cwrNumber,
          verifiedWr: verifiedWr.length,
          warehouseLocation: input.warehouseLocation,
          incidents: input.units.filter((u) => u.state === "incident").map((u) => ({ key: u.key, incident: u.incident })),
        },
      })

      // Customer notification (recorded to the audit trail as the notify event).
      await recordAudit({
        actorUserId: admin.id,
        actorName: admin.name,
        action: "CUSTOMER_NOTIFIED",
        entityType: "consolidation",
        entityId: cwr.cwrNumber ?? undefined,
        metadata: { cwrNumber: cwr.cwrNumber, userId: cwr.userId, reason: "READY_FOR_DELIVERY_AR" },
      })

      revalidatePath("/admin/desconsolidar-cwr")
      revalidatePath("/admin")
      return { ok: true }
    })
  } catch {
    return { error: "No se pudo completar la desconsolidación. Reintentá." }
  }
}

// ==========================================================================
// Loaders used by the deconsolidation scan pages.
// ==========================================================================

export type McContents = {
  id: number
  mcNumber: string
  status: string
  units: ScanUnit[]
}

/** Load an MC by scanned number and return its expected contents as scan units. */
export async function loadMcForDeconsolidation(code: string): Promise<{ error?: string; mc?: McContents }> {
  await requirePermission("deconsolidation.manage")
  const c = normCode(code)
  const [mc] = await db.select().from(masterConsolidations).where(sql`upper(${masterConsolidations.mcNumber}) = ${c}`).limit(1)
  if (!mc) return { error: `Carga maestra no encontrada: ${code}` }
  if (mc.status === "DECONSOLIDATED") return { error: `${mc.mcNumber} ya fue desconsolidada.` }

  const cwrRows = (mc.cwrIds ?? []).length
    ? await db
        .select({ id: consolidations.id, cwrNumber: consolidations.cwrNumber, weightLb: consolidations.weightLb, pieces: consolidations.pieces, customerName: userTable.name })
        .from(consolidations)
        .leftJoin(userTable, eq(userTable.id, consolidations.userId))
        .where(inArray(consolidations.id, mc.cwrIds))
    : []
  const wrRows = (mc.packageIds ?? []).length
    ? await db
        .select({ id: packages.id, wrNumber: packages.wrNumber, customerName: userTable.name, boxNumber: packages.boxNumber, weightLb: packages.weightLb, quantity: packages.quantity, description: packages.description })
        .from(packages)
        .leftJoin(userTable, eq(userTable.id, packages.userId))
        .where(inArray(packages.id, mc.packageIds))
    : []

  const units: ScanUnit[] = [
    ...cwrRows.map((c2) => ({
      key: `cwr:${c2.id}`,
      code: c2.cwrNumber ?? `#${c2.id}`,
      title: c2.cwrNumber ?? `#${c2.id}`,
      subtitle: `${c2.customerName ?? DASH} · CWR`,
      meta: c2.weightLb ? `${c2.weightLb} lb` : `${c2.pieces ?? 0} pz`,
      state: "pending" as const,
    })),
    ...wrRows.map(pkgUnit),
  ]
  return { mc: { id: mc.id, mcNumber: mc.mcNumber ?? c, status: mc.status, units } }
}

export type CwrContents = {
  id: number
  cwrNumber: string
  status: string
  customerName: string | null
  units: ScanUnit[]
}

/** Load a CWR by scanned number and return its WR as scan units. */
export async function loadCwrForDeconsolidation(code: string): Promise<{ error?: string; cwr?: CwrContents }> {
  await requirePermission("deconsolidation.manage")
  const c = normCode(code)
  const [cwr] = await db
    .select({ id: consolidations.id, cwrNumber: consolidations.cwrNumber, status: consolidations.status, userId: consolidations.userId, packageIds: consolidations.packageIds, customerName: userTable.name })
    .from(consolidations)
    .leftJoin(userTable, eq(userTable.id, consolidations.userId))
    .where(sql`upper(${consolidations.cwrNumber}) = ${c}`)
    .limit(1)
  if (!cwr) return { error: `CWR no encontrado: ${code}` }
  if (cwr.status === "DECONSOLIDATED") return { error: `${cwr.cwrNumber} ya fue desconsolidado.` }

  const wrRows = (cwr.packageIds ?? []).length
    ? await db
        .select({ id: packages.id, wrNumber: packages.wrNumber, customerName: userTable.name, boxNumber: packages.boxNumber, weightLb: packages.weightLb, quantity: packages.quantity, description: packages.description })
        .from(packages)
        .leftJoin(userTable, eq(userTable.id, packages.userId))
        .where(inArray(packages.id, cwr.packageIds))
    : []

  return {
    cwr: {
      id: cwr.id,
      cwrNumber: cwr.cwrNumber ?? c,
      status: cwr.status,
      customerName: cwr.customerName,
      units: wrRows.map(pkgUnit),
    },
  }
}
