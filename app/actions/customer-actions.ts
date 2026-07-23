"use server"

import { revalidatePath } from "next/cache"
import { and, eq, inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { prealerts, packages, consolidations, customerProfile, user as userTable } from "@/lib/db/schema"
import { requireCustomer } from "@/lib/session"
import { creditWallet } from "@/lib/wallet"
import { recordAudit } from "@/lib/audit"

export type ActionState = { error?: string; ok?: boolean; message?: string }

export async function createPrealert(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireCustomer()
  const store = String(formData.get("store") ?? "").trim()
  const trackingNumber = String(formData.get("trackingNumber") ?? "").trim()
  const carrier = String(formData.get("carrier") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const estimatedValueRaw = String(formData.get("estimatedValue") ?? "").trim()

  if (!store) return { error: "Indicá la tienda donde compraste." }

  await db.insert(prealerts).values({
    userId: user.id,
    store,
    trackingNumber: trackingNumber || null,
    carrier: carrier || null,
    description: description || null,
    estimatedValue: estimatedValueRaw ? estimatedValueRaw : null,
    status: "PENDING",
  })

  // Also create an EXPECTED package so it shows in the customer's package list.
  await db.insert(packages).values({
    userId: user.id,
    boxNumber: user.boxNumber,
    status: "EXPECTED",
    store,
    trackingNumber: trackingNumber || null,
    carrier: carrier || null,
    description: description || null,
    declaredValue: estimatedValueRaw ? estimatedValueRaw : null,
  })

  await recordAudit({
    actorUserId: user.id,
    actorName: user.name,
    action: "PREALERT_CREATED",
    entityType: "prealert",
    metadata: { store, trackingNumber },
  })

  revalidatePath("/panel/paquetes")
  revalidatePath("/panel/prealertar")
  revalidatePath("/panel")
  return { ok: true, message: "Prealerta creada. Te avisaremos cuando llegue a Miami." }
}

export async function requestConsolidation(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireCustomer()
  const ids = formData
    .getAll("packageIds")
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n))
  const notes = String(formData.get("notes") ?? "").trim()

  if (ids.length < 1) return { error: "Seleccioná al menos un paquete para preparar el envío." }

  // Verify all packages belong to this customer and are available.
  const owned = await db
    .select()
    .from(packages)
    .where(and(eq(packages.userId, user.id), inArray(packages.id, ids)))
  if (owned.length !== ids.length) return { error: "Alguno de los paquetes no es válido." }

  const [cons] = await db
    .insert(consolidations)
    .values({ userId: user.id, status: "REQUESTED", packageIds: ids, notes: notes || null })
    .returning()

  await db
    .update(packages)
    .set({ status: "CONSOLIDATING", consolidationId: cons.id, updatedAt: new Date() })
    .where(and(eq(packages.userId, user.id), inArray(packages.id, ids)))

  await recordAudit({
    actorUserId: user.id,
    actorName: user.name,
    action: "CONSOLIDATION_REQUESTED",
    entityType: "consolidation",
    entityId: cons.id,
    metadata: { packageIds: ids },
  })

  revalidatePath("/panel/consolidaciones")
  revalidatePath("/panel/paquetes")
  return { ok: true, message: "Solicitud de consolidación enviada." }
}

// Placeholder deposit flow — simulates a completed Stripe payment.
// Real Stripe credentials are wired later via lib/payments.ts.
export async function simulateDeposit(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireCustomer()
  const amount = Number(formData.get("amount"))
  if (!Number.isFinite(amount) || amount <= 0) return { error: "Ingresá un monto válido." }
  if (amount > 10000) return { error: "El monto máximo por carga es USD 10.000." }

  await creditWallet({
    userId: user.id,
    amount,
    type: "CREDIT",
    description: "Carga de saldo (pago simulado)",
    reference: `SIMULATED-${Date.now()}`,
    createdByUserId: user.id,
  })

  await recordAudit({
    actorUserId: user.id,
    actorName: user.name,
    action: "WALLET_DEPOSIT",
    entityType: "wallet",
    metadata: { amount },
  })

  revalidatePath("/panel/billetera")
  revalidatePath("/panel")
  return { ok: true, message: `Se acreditaron USD ${amount.toFixed(2)} a tu billetera.` }
}

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireCustomer()
  const phone = String(formData.get("phone") ?? "").trim()
  const street = String(formData.get("street") ?? "").trim()
  const streetNumber = String(formData.get("streetNumber") ?? "").trim()
  const floor = String(formData.get("floor") ?? "").trim()
  const apartment = String(formData.get("apartment") ?? "").trim()
  const city = String(formData.get("city") ?? "").trim()
  const province = String(formData.get("province") ?? "").trim()
  const postalCode = String(formData.get("postalCode") ?? "").trim()
  const refs = String(formData.get("references") ?? "").trim()

  if (!street || !streetNumber || !city || !province || !postalCode) {
    return { error: "Completá los campos obligatorios de tu dirección." }
  }

  await db.update(userTable).set({ phone: phone || null, updatedAt: new Date() }).where(eq(userTable.id, user.id))
  await db
    .update(customerProfile)
    .set({
      street,
      streetNumber,
      floor: floor || null,
      apartment: apartment || null,
      city,
      province,
      postalCode,
      references: refs || null,
      updatedAt: new Date(),
    })
    .where(eq(customerProfile.userId, user.id))

  await recordAudit({
    actorUserId: user.id,
    actorName: user.name,
    action: "PROFILE_UPDATED",
    entityType: "user",
    entityId: user.id,
  })

  revalidatePath("/panel/perfil")
  return { ok: true, message: "Datos actualizados correctamente." }
}
