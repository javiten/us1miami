"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { packages } from "@/lib/db/schema"
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

export async function updatePackageStatus(_prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const admin = await requirePermission("warehouse.records")
  const id = Number(formData.get("packageId"))
  const status = String(formData.get("status") ?? "")
  if (!Number.isFinite(id) || !status) return { error: "Datos inválidos." }

  await db.update(packages).set({ status, updatedAt: new Date() }).where(eq(packages.id, id))

  await recordAudit({
    actorUserId: admin.id,
    actorName: admin.name,
    action: "PACKAGE_STATUS_CHANGED",
    entityType: "package",
    entityId: id,
    metadata: { status },
  })

  revalidatePath("/admin/paquetes")
  revalidatePath(`/admin/paquetes/${id}`)
  return { ok: true, message: "Estado actualizado." }
}
