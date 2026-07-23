"use server"

import { revalidatePath } from "next/cache"
import { and, eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { invoices, consolidations, wallet, walletTransaction } from "@/lib/db/schema"
import { requireCustomer, requirePermission, type SessionUser } from "@/lib/session"
import { recordAudit } from "@/lib/audit"
import { createInvoiceCardCheckout } from "@/lib/payments"
import { priceByBillableKg, computeCwrPricing } from "@/lib/pricing"
import type { PaymentMethod } from "@/lib/invoices"

export type PayState = { ok?: boolean; error?: string; message?: string; redirectUrl?: string }

function revalidateAll(cwrId?: number) {
  revalidatePath("/panel/consolidaciones")
  revalidatePath("/panel/billetera")
  revalidatePath("/panel")
  revalidatePath("/admin/invoices")
  revalidatePath("/admin")
  if (cwrId) {
    revalidatePath(`/panel/facturas/${cwrId}`)
  }
}

// Internal: within a transaction, flip an invoice to PAID and release its CWR
// to READY_TO_SHIP. Never downgrades a CWR that already moved further along.
async function markPaidTx(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  invoice: { id: number; invoiceNumber: string | null; consolidationId: number },
  opts: { method: PaymentMethod; reference?: string | null; confirmedBy?: SessionUser | null },
) {
  await tx
    .update(invoices)
    .set({
      status: "PAID",
      paymentMethod: opts.method,
      paymentReference: opts.reference ?? null,
      paidAt: new Date(),
      confirmedByUserId: opts.confirmedBy?.id ?? null,
      confirmedByName: opts.confirmedBy?.name ?? null,
      updatedAt: new Date(),
    })
    .where(eq(invoices.id, invoice.id))

  await tx
    .update(consolidations)
    .set({ status: "READY_TO_SHIP", updatedAt: new Date() })
    .where(and(eq(consolidations.id, invoice.consolidationId), eq(consolidations.status, "PENDING_PAYMENT")))
}

// ==========================================================================
// CUSTOMER PAYMENT OPTIONS
// ==========================================================================

/** Pay a shipping invoice from the wallet balance — atomic, idempotent. */
export async function payInvoiceWithWallet(invoiceId: number): Promise<PayState> {
  const user = await requireCustomer()
  try {
    const result = await db.transaction(async (tx) => {
      // Lock the invoice row for the duration of the transaction.
      const [inv] = await tx.select().from(invoices).where(eq(invoices.id, invoiceId)).for("update").limit(1)
      if (!inv) return { error: "Factura no encontrada." }
      if (inv.userId !== user.id) return { error: "Esta factura no te pertenece." }
      if (inv.status === "PAID") return { ok: true, message: "La factura ya estaba pagada." }
      if (inv.status === "REQUIRES_REVIEW")
        return { error: "Esta factura requiere revisión de US1 Miami antes de poder pagarse." }
      if (inv.status === "CANCELLED") return { error: "La factura fue cancelada." }
      if (inv.status !== "OPEN") return { error: "La factura no está disponible para pago con billetera." }
      if (inv.subtotal == null) return { error: "La factura no tiene un monto válido." }

      const amount = Number(inv.subtotal)

      // Idempotency backstop: never post a second debit for the same invoice.
      const existing = await tx
        .select({ id: walletTransaction.id })
        .from(walletTransaction)
        .where(and(eq(walletTransaction.userId, user.id), eq(walletTransaction.reference, inv.invoiceNumber ?? `INV#${inv.id}`)))
        .limit(1)
      if (existing.length > 0) return { error: "El pago de esta factura ya fue registrado." }

      // Lock the wallet and check funds.
      await tx.insert(wallet).values({ userId: user.id }).onConflictDoNothing()
      const [w] = await tx.select().from(wallet).where(eq(wallet.userId, user.id)).for("update").limit(1)
      const balance = Number(w?.availableBalance ?? 0)
      if (balance < amount)
        return { error: `Saldo insuficiente. Necesitás USD ${amount.toFixed(2)} y tenés USD ${balance.toFixed(2)}.` }

      const [updatedWallet] = await tx
        .update(wallet)
        .set({
          availableBalance: sql`(${wallet.availableBalance} - ${amount})::numeric(12,2)`,
          updatedAt: new Date(),
        })
        .where(eq(wallet.userId, user.id))
        .returning()

      await tx.insert(walletTransaction).values({
        userId: user.id,
        walletId: updatedWallet.id,
        type: "DEBIT",
        amount: amount.toFixed(2),
        balanceAfter: updatedWallet.availableBalance,
        description: `Cargo de envío ${inv.invoiceNumber ?? ""}`.trim(),
        reference: inv.invoiceNumber ?? `INV#${inv.id}`,
        createdByUserId: user.id,
      })

      await markPaidTx(tx, inv, { method: "WALLET", reference: inv.invoiceNumber, confirmedBy: user })
      return { ok: true, invoiceNumber: inv.invoiceNumber, consolidationId: inv.consolidationId, amount }
    })

    if (result.error) return { error: result.error }
    await recordAudit({
      actorUserId: user.id,
      actorName: user.name,
      action: "INVOICE_PAID_WALLET",
      entityType: "invoice",
      entityId: result.invoiceNumber ?? String(invoiceId),
      metadata: { method: "WALLET", amount: result.amount },
    })
    revalidateAll(result.consolidationId)
    return { ok: true, message: result.message ?? "Pago realizado con tu saldo. El envío ya está habilitado." }
  } catch (err) {
    console.log("[v0] payInvoiceWithWallet failed:", (err as Error).message)
    return { error: "No se pudo procesar el pago. Reintentá." }
  }
}

/** Begin a card payment. Returns a checkout URL (or a simulated confirm token). */
export async function startInvoiceCardPayment(invoiceId: number): Promise<PayState & { sessionId?: string; simulated?: boolean }> {
  const user = await requireCustomer()
  const [inv] = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1)
  if (!inv) return { error: "Factura no encontrada." }
  if (inv.userId !== user.id) return { error: "Esta factura no te pertenece." }
  if (inv.status === "PAID") return { ok: true, message: "La factura ya estaba pagada." }
  if (inv.status === "REQUIRES_REVIEW") return { error: "Esta factura requiere revisión antes de poder pagarse." }
  if (inv.status !== "OPEN") return { error: "La factura no está disponible para pago con tarjeta." }
  if (inv.subtotal == null) return { error: "La factura no tiene un monto válido." }

  const session = await createInvoiceCardCheckout({
    invoiceId: inv.id,
    invoiceNumber: inv.invoiceNumber ?? `INV#${inv.id}`,
    amountUsd: Number(inv.subtotal),
    customerEmail: user.email,
  })

  // Persist the session id for idempotent confirmation.
  await db.update(invoices).set({ stripeSessionId: session.sessionId, paymentMethod: "CARD", updatedAt: new Date() }).where(eq(invoices.id, inv.id))

  return {
    ok: true,
    sessionId: session.sessionId,
    simulated: session.provider === "placeholder",
    redirectUrl: session.requiresRedirect ? session.url : undefined,
  }
}

/** Confirm a card payment. Idempotent: a session id can only settle once. */
export async function confirmInvoiceCardPayment(invoiceId: number, sessionId: string): Promise<PayState> {
  const user = await requireCustomer()
  try {
    const result = await db.transaction(async (tx) => {
      const [inv] = await tx.select().from(invoices).where(eq(invoices.id, invoiceId)).for("update").limit(1)
      if (!inv) return { error: "Factura no encontrada." }
      if (inv.userId !== user.id) return { error: "Esta factura no te pertenece." }
      if (inv.status === "PAID") return { ok: true, message: "La factura ya estaba pagada." }
      if (inv.status !== "OPEN") return { error: "La factura no está disponible." }
      if (!inv.stripeSessionId || inv.stripeSessionId !== sessionId)
        return { error: "La sesión de pago no es válida." }

      await markPaidTx(tx, inv, { method: "CARD", reference: sessionId, confirmedBy: user })
      return { ok: true, invoiceNumber: inv.invoiceNumber, consolidationId: inv.consolidationId, amount: Number(inv.subtotal) }
    })
    if (result.error) return { error: result.error }
    await recordAudit({
      actorUserId: user.id,
      actorName: user.name,
      action: "INVOICE_PAID_CARD",
      entityType: "invoice",
      entityId: result.invoiceNumber ?? String(invoiceId),
      metadata: { method: "CARD", reference: sessionId, amount: result.amount },
    })
    revalidateAll(result.consolidationId)
    return { ok: true, message: result.message ?? "Pago con tarjeta confirmado. El envío ya está habilitado." }
  } catch (err) {
    console.log("[v0] confirmInvoiceCardPayment failed:", (err as Error).message)
    return { error: "No se pudo confirmar el pago. Reintentá." }
  }
}

/** Choose cash or Mercado Pago: invoice goes to manual verification (NOT paid). */
export async function selectManualPayment(invoiceId: number, method: "CASH" | "MERCADO_PAGO"): Promise<PayState> {
  const user = await requireCustomer()
  try {
    const result = await db.transaction(async (tx) => {
      const [inv] = await tx.select().from(invoices).where(eq(invoices.id, invoiceId)).for("update").limit(1)
      if (!inv) return { error: "Factura no encontrada." }
      if (inv.userId !== user.id) return { error: "Esta factura no te pertenece." }
      if (inv.status === "PAID") return { error: "La factura ya está pagada." }
      if (inv.status === "REQUIRES_REVIEW") return { error: "Esta factura requiere revisión antes de poder pagarse." }
      if (inv.status !== "OPEN" && inv.status !== "PENDING_MANUAL_PAYMENT")
        return { error: "La factura no está disponible." }

      await tx
        .update(invoices)
        .set({ status: "PENDING_MANUAL_PAYMENT", paymentMethod: method, updatedAt: new Date() })
        .where(eq(invoices.id, inv.id))
      return { ok: true, invoiceNumber: inv.invoiceNumber, consolidationId: inv.consolidationId }
    })
    if (result.error) return { error: result.error }
    await recordAudit({
      actorUserId: user.id,
      actorName: user.name,
      action: "INVOICE_MANUAL_SELECTED",
      entityType: "invoice",
      entityId: result.invoiceNumber ?? String(invoiceId),
      metadata: { method },
    })
    revalidateAll(result.consolidationId)
    return {
      ok: true,
      message:
        method === "CASH"
          ? "Registramos que pagarás en efectivo. Tu envío queda en espera hasta que US1 Miami verifique el pago."
          : "Registramos tu pago por Mercado Pago. Tu envío queda en espera hasta que US1 Miami lo verifique.",
    }
  } catch (err) {
    console.log("[v0] selectManualPayment failed:", (err as Error).message)
    return { error: "No se pudo registrar la opción de pago. Reintentá." }
  }
}

// ==========================================================================
// ADMIN / OPERATIONS
// ==========================================================================

/** Confirm a cash or Mercado Pago payment. Idempotent; requires manage perm. */
export async function confirmManualPayment(input: {
  invoiceId: number
  reference?: string
  notes?: string
}): Promise<PayState> {
  const admin = await requirePermission("invoices.manage")
  try {
    const result = await db.transaction(async (tx) => {
      const [inv] = await tx.select().from(invoices).where(eq(invoices.id, input.invoiceId)).for("update").limit(1)
      if (!inv) return { error: "Factura no encontrada." }
      if (inv.status === "PAID") return { error: "Esta factura ya fue pagada. No se puede confirmar dos veces." }
      if (inv.status !== "PENDING_MANUAL_PAYMENT")
        return { error: "Solo se pueden confirmar pagos en verificación (efectivo / Mercado Pago)." }

      const method = (inv.paymentMethod as PaymentMethod) ?? "CASH"
      await tx
        .update(invoices)
        .set({
          internalNotes: input.notes ? `${inv.internalNotes ? inv.internalNotes + "\n" : ""}${input.notes}` : inv.internalNotes,
        })
        .where(eq(invoices.id, inv.id))
      await markPaidTx(tx, inv, { method, reference: input.reference ?? null, confirmedBy: admin })
      return { ok: true, invoiceNumber: inv.invoiceNumber, consolidationId: inv.consolidationId, method }
    })
    if (result.error) return { error: result.error }
    await recordAudit({
      actorUserId: admin.id,
      actorName: admin.name,
      action: "INVOICE_MANUAL_CONFIRMED",
      entityType: "invoice",
      entityId: result.invoiceNumber ?? String(input.invoiceId),
      metadata: { method: result.method, reference: input.reference, notes: input.notes, confirmedBy: admin.name },
    })
    revalidateAll(result.consolidationId)
    revalidatePath(`/admin/invoices/${input.invoiceId}`)
    return { ok: true, message: "Pago confirmado. El envío quedó habilitado (READY_TO_SHIP)." }
  } catch (err) {
    console.log("[v0] confirmManualPayment failed:", (err as Error).message)
    return { error: "No se pudo confirmar el pago. Reintentá." }
  }
}

/** Cancel an unpaid invoice (with reason). Keeps the CWR blocked. */
export async function cancelInvoice(input: { invoiceId: number; reason?: string }): Promise<PayState> {
  const admin = await requirePermission("invoices.manage")
  try {
    const result = await db.transaction(async (tx) => {
      const [inv] = await tx.select().from(invoices).where(eq(invoices.id, input.invoiceId)).for("update").limit(1)
      if (!inv) return { error: "Factura no encontrada." }
      if (inv.status === "PAID") return { error: "No se puede cancelar una factura pagada." }
      if (inv.status === "CANCELLED") return { error: "La factura ya está cancelada." }
      await tx
        .update(invoices)
        .set({
          status: "CANCELLED",
          internalNotes: input.reason ? `${inv.internalNotes ? inv.internalNotes + "\n" : ""}Cancelada: ${input.reason}` : inv.internalNotes,
          updatedAt: new Date(),
        })
        .where(eq(invoices.id, inv.id))
      return { ok: true, invoiceNumber: inv.invoiceNumber, consolidationId: inv.consolidationId }
    })
    if (result.error) return { error: result.error }
    await recordAudit({
      actorUserId: admin.id,
      actorName: admin.name,
      action: "INVOICE_CANCELLED",
      entityType: "invoice",
      entityId: result.invoiceNumber ?? String(input.invoiceId),
      metadata: { reason: input.reason, by: admin.name },
    })
    revalidateAll(result.consolidationId)
    revalidatePath(`/admin/invoices/${input.invoiceId}`)
    return { ok: true, message: "Factura cancelada." }
  } catch (err) {
    console.log("[v0] cancelInvoice failed:", (err as Error).message)
    return { error: "No se pudo cancelar la factura. Reintentá." }
  }
}

/** Reopen a cancelled invoice back to its payable state. */
export async function reopenInvoice(input: { invoiceId: number }): Promise<PayState> {
  const admin = await requirePermission("invoices.manage")
  try {
    const result = await db.transaction(async (tx) => {
      const [inv] = await tx.select().from(invoices).where(eq(invoices.id, input.invoiceId)).for("update").limit(1)
      if (!inv) return { error: "Factura no encontrada." }
      if (inv.status !== "CANCELLED") return { error: "Solo se pueden reabrir facturas canceladas." }
      const nextStatus = inv.subtotal == null ? "REQUIRES_REVIEW" : "OPEN"
      await tx
        .update(invoices)
        .set({ status: nextStatus, paymentMethod: null, updatedAt: new Date() })
        .where(eq(invoices.id, inv.id))
      return { ok: true, invoiceNumber: inv.invoiceNumber, consolidationId: inv.consolidationId, nextStatus }
    })
    if (result.error) return { error: result.error }
    await recordAudit({
      actorUserId: admin.id,
      actorName: admin.name,
      action: "INVOICE_REOPENED",
      entityType: "invoice",
      entityId: result.invoiceNumber ?? String(input.invoiceId),
      metadata: { by: admin.name, status: result.nextStatus },
    })
    revalidateAll(result.consolidationId)
    revalidatePath(`/admin/invoices/${input.invoiceId}`)
    return { ok: true, message: "Factura reabierta." }
  } catch (err) {
    console.log("[v0] reopenInvoice failed:", (err as Error).message)
    return { error: "No se pudo reabrir la factura. Reintentá." }
  }
}

/** Append an internal note to an invoice. */
export async function addInvoiceNote(input: { invoiceId: number; note: string }): Promise<PayState> {
  const admin = await requirePermission("invoices.manage")
  const note = input.note.trim()
  if (!note) return { error: "La nota no puede estar vacía." }
  const [inv] = await db.select().from(invoices).where(eq(invoices.id, input.invoiceId)).limit(1)
  if (!inv) return { error: "Factura no encontrada." }
  const stamped = `[${new Date().toLocaleString("es-AR")} · ${admin.name}] ${note}`
  await db
    .update(invoices)
    .set({ internalNotes: `${inv.internalNotes ? inv.internalNotes + "\n" : ""}${stamped}`, updatedAt: new Date() })
    .where(eq(invoices.id, inv.id))
  await recordAudit({
    actorUserId: admin.id,
    actorName: admin.name,
    action: "INVOICE_NOTE_ADDED",
    entityType: "invoice",
    entityId: inv.invoiceNumber ?? String(input.invoiceId),
    metadata: { note },
  })
  revalidatePath(`/admin/invoices/${input.invoiceId}`)
  return { ok: true, message: "Nota agregada." }
}

/**
 * Controlled recalculation. Re-derives weights/rate/total from the CWR's
 * current measurements. Only allowed while the invoice is not PAID — this is
 * the single sanctioned path to change a calculated amount.
 */
export async function recalculateInvoice(input: { invoiceId: number }): Promise<PayState> {
  const admin = await requirePermission("invoices.manage")
  try {
    const result = await db.transaction(async (tx) => {
      const [inv] = await tx.select().from(invoices).where(eq(invoices.id, input.invoiceId)).for("update").limit(1)
      if (!inv) return { error: "Factura no encontrada." }
      if (inv.status === "PAID") return { error: "No se puede recalcular una factura pagada." }
      if (inv.status === "CANCELLED") return { error: "No se puede recalcular una factura cancelada." }

      const [cwr] = await tx.select().from(consolidations).where(eq(consolidations.id, inv.consolidationId)).limit(1)
      if (!cwr || !cwr.weightLb) return { error: "El CWR no tiene peso final para recalcular." }

      const pricing = computeCwrPricing({
        weightLb: Number(cwr.weightLb),
        lengthIn: cwr.lengthIn != null ? Number(cwr.lengthIn) : null,
        widthIn: cwr.widthIn != null ? Number(cwr.widthIn) : null,
        heightIn: cwr.heightIn != null ? Number(cwr.heightIn) : null,
      })

      // Preserve a manual verification selection unless it now needs review.
      const nextStatus = pricing.requiresReview
        ? "REQUIRES_REVIEW"
        : inv.status === "REQUIRES_REVIEW"
          ? "OPEN"
          : inv.status

      await tx
        .update(invoices)
        .set({
          actualWeightKg: String(pricing.actualWeightKg),
          volumetricWeightKg: String(pricing.volumetricWeightKg),
          billableWeightKg: String(pricing.billableWeightKg),
          ratePerKg: pricing.ratePerKg != null ? String(pricing.ratePerKg) : null,
          subtotal: pricing.subtotal != null ? String(pricing.subtotal) : null,
          status: nextStatus,
          updatedAt: new Date(),
        })
        .where(eq(invoices.id, inv.id))
      return { ok: true, invoiceNumber: inv.invoiceNumber, consolidationId: inv.consolidationId, pricing }
    })
    if (result.error) return { error: result.error }
    await recordAudit({
      actorUserId: admin.id,
      actorName: admin.name,
      action: "INVOICE_RECALCULATED",
      entityType: "invoice",
      entityId: result.invoiceNumber ?? String(input.invoiceId),
      metadata: { by: admin.name, ...result.pricing },
    })
    revalidateAll(result.consolidationId)
    revalidatePath(`/admin/invoices/${input.invoiceId}`)
    return { ok: true, message: "Factura recalculada." }
  } catch (err) {
    console.log("[v0] recalculateInvoice failed:", (err as Error).message)
    return { error: "No se pudo recalcular la factura. Reintentá." }
  }
}

// Silence unused import in environments where priceByBillableKg is tree-shaken.
void priceByBillableKg
