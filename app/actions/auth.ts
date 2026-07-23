"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { user, customerProfile, wallet } from "@/lib/db/schema"
import { nextCounter, formatBoxNumber } from "@/lib/counters"
import { recordAudit } from "@/lib/audit"

export type RegisterState = { error?: string; ok?: boolean }

export async function registerCustomer(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const firstName = String(formData.get("firstName") ?? "").trim()
  const lastName = String(formData.get("lastName") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")
  const confirm = String(formData.get("confirm") ?? "")

  const street = String(formData.get("street") ?? "").trim()
  const streetNumber = String(formData.get("streetNumber") ?? "").trim()
  const floor = String(formData.get("floor") ?? "").trim()
  const apartment = String(formData.get("apartment") ?? "").trim()
  const city = String(formData.get("city") ?? "").trim()
  const province = String(formData.get("province") ?? "").trim()
  const postalCode = String(formData.get("postalCode") ?? "").trim()
  const refs = String(formData.get("references") ?? "").trim()

  const acceptedTerms = formData.get("acceptedTerms") === "on"
  const acceptedPrivacy = formData.get("acceptedPrivacy") === "on"
  const acceptedProhibited = formData.get("acceptedProhibited") === "on"
  const acceptedStorage = formData.get("acceptedStorage") === "on"

  if (!firstName || !lastName || !email || !password) {
    return { error: "Completá todos los campos obligatorios." }
  }
  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." }
  }
  if (password !== confirm) {
    return { error: "Las contraseñas no coinciden." }
  }
  if (!street || !streetNumber || !city || !province || !postalCode) {
    return { error: "Completá tu dirección de entrega en Argentina." }
  }
  if (!acceptedTerms || !acceptedPrivacy || !acceptedProhibited || !acceptedStorage) {
    return { error: "Debés aceptar todas las condiciones para continuar." }
  }

  const existing = await db.select().from(user).where(eq(user.email, email)).limit(1)
  if (existing.length > 0) {
    return { error: "Ya existe una cuenta con este email." }
  }

  try {
    await auth.api.signUpEmail({
      body: { email, password, name: `${firstName} ${lastName}` },
    })
  } catch {
    return { error: "No pudimos crear la cuenta. Intentá nuevamente." }
  }

  const rows = await db.select().from(user).where(eq(user.email, email)).limit(1)
  const created = rows[0]
  if (!created) return { error: "Error al crear la cuenta." }

  // Assign the next sequential, immutable box number (starts at US1-1001).
  const boxNumber = formatBoxNumber(await nextCounter("box"))

  await db
    .update(user)
    .set({ role: "CUSTOMER", boxNumber, phone, updatedAt: new Date() })
    .where(eq(user.id, created.id))

  await db.insert(customerProfile).values({
    userId: created.id,
    firstName,
    lastName,
    street,
    streetNumber,
    floor: floor || null,
    apartment: apartment || null,
    city,
    province,
    postalCode,
    references: refs || null,
    acceptedTerms,
    acceptedPrivacy,
    acceptedProhibited,
    acceptedStorage,
  })

  await db.insert(wallet).values({ userId: created.id }).onConflictDoNothing()

  await recordAudit({
    actorUserId: created.id,
    actorName: `${firstName} ${lastName}`,
    action: "CUSTOMER_REGISTERED",
    entityType: "user",
    entityId: created.id,
    metadata: { boxNumber },
  })

  return { ok: true }
}

export async function signOutAction() {
  // Destroy the server session and clear the auth cookie. The nextCookies()
  // plugin flushes the Set-Cookie into this server-action response, so the
  // browser drops the session immediately. Then bounce to the admin login,
  // which the layout guard also blocks for unauthenticated users.
  try {
    await auth.api.signOut({ headers: await headers() })
  } catch {
    // Session may already be gone; proceed to redirect regardless.
  }
  redirect("/admin/login")
}
