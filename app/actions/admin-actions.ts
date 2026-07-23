"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { user, customerProfile } from "@/lib/db/schema"
import { requirePermission } from "@/lib/session"
import { creditWallet } from "@/lib/wallet"
import { recordAudit } from "@/lib/audit"

export type AdminActionState = { error?: string; ok?: boolean; message?: string }

export async function adjustWallet(_prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const admin = await requirePermission("wallets.adjust")
  const targetUserId = String(formData.get("userId") ?? "")
  const direction = String(formData.get("direction") ?? "credit")
  const amount = Number(formData.get("amount"))
  const reason = String(formData.get("reason") ?? "").trim()

  if (!targetUserId) return { error: "Cliente inválido." }
  if (!Number.isFinite(amount) || amount <= 0) return { error: "Ingresá un monto válido." }
  if (!reason) return { error: "Indicá el motivo del ajuste." }

  try {
    await creditWallet({
      userId: targetUserId,
      amount,
      type: direction === "credit" ? "CREDIT" : "DEBIT",
      description: `Ajuste manual: ${reason}`,
      createdByUserId: admin.id,
    })
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo realizar el ajuste." }
  }

  await recordAudit({
    actorUserId: admin.id,
    actorName: admin.name,
    action: direction === "credit" ? "WALLET_CREDIT" : "WALLET_DEBIT",
    entityType: "wallet",
    entityId: targetUserId,
    metadata: { amount, reason },
  })

  revalidatePath(`/admin/clientes/${targetUserId}`)
  revalidatePath("/admin/billeteras")
  return { ok: true, message: "Ajuste aplicado correctamente." }
}

/**
 * Update a customer's contact + Argentina delivery profile. Restricted to
 * Customer Support / Super-Admin via `customers.manage`. Records an audit diff.
 */
export async function updateCustomer(_prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const admin = await requirePermission("customers.manage")
  const userId = String(formData.get("userId") ?? "")
  if (!userId) return { error: "Cliente inválido." }

  const name = String(formData.get("name") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  if (!name) return { error: "El nombre es obligatorio." }

  const [current] = await db.select().from(user).where(eq(user.id, userId)).limit(1)
  if (!current) return { error: "Cliente no encontrado." }

  await db.update(user).set({ name, phone: phone || null }).where(eq(user.id, userId))

  const firstName = String(formData.get("firstName") ?? "").trim()
  const lastName = String(formData.get("lastName") ?? "").trim()
  // Nullable address fields.
  const addressFields = {
    street: String(formData.get("street") ?? "").trim() || null,
    streetNumber: String(formData.get("streetNumber") ?? "").trim() || null,
    floor: String(formData.get("floor") ?? "").trim() || null,
    apartment: String(formData.get("apartment") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim() || null,
    province: String(formData.get("province") ?? "").trim() || null,
    postalCode: String(formData.get("postalCode") ?? "").trim() || null,
    references: String(formData.get("references") ?? "").trim() || null,
  }

  const [existingProfile] = await db
    .select({ userId: customerProfile.userId })
    .from(customerProfile)
    .where(eq(customerProfile.userId, userId))
    .limit(1)

  if (existingProfile) {
    // firstName/lastName are NOT NULL, so only update them when provided.
    await db
      .update(customerProfile)
      .set({
        ...addressFields,
        ...(firstName ? { firstName } : {}),
        ...(lastName ? { lastName } : {}),
      })
      .where(eq(customerProfile.userId, userId))
  } else if (firstName) {
    await db.insert(customerProfile).values({ userId, firstName, lastName, ...addressFields })
  }

  await recordAudit({
    actorUserId: admin.id,
    actorName: admin.name,
    action: "CUSTOMER_UPDATED",
    entityType: "customer",
    entityId: userId,
    metadata: { name, phone: phone || null },
  })

  revalidatePath(`/admin/clientes/${userId}`)
  revalidatePath("/admin/clientes")
  return { ok: true, message: "Cliente actualizado." }
}
