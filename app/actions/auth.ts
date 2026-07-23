"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq, sql } from "drizzle-orm"
import { auth, authAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { user, account, session as sessionTable, customerProfile, wallet } from "@/lib/db/schema"
import { formatBoxNumber } from "@/lib/counters"
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

  // 1) Create the auth user (hashes the password, creates the account row, and
  //    with autoSignIn establishes the session + cookie via the nextCookies plugin).
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

  // 2) Assign box + profile + wallet atomically. The box counter is incremented
  //    INSIDE the transaction so a rollback never consumes a box number, and a
  //    mid-way failure leaves no partial profile/wallet.
  let boxNumber: string
  try {
    boxNumber = await db.transaction(async (tx) => {
      const res = await tx.execute(
        sql`UPDATE "counters" SET "value" = "value" + 1 WHERE "name" = 'box' RETURNING "value"`,
      )
      const value = Number((res.rows?.[0] as { value?: number } | undefined)?.value)
      if (!value) throw new Error("box counter missing")
      const box = formatBoxNumber(value)

      await tx
        .update(user)
        .set({ role: "CUSTOMER", boxNumber: box, phone: phone || null, updatedAt: new Date() })
        .where(eq(user.id, created.id))

      await tx.insert(customerProfile).values({
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

      await tx.insert(wallet).values({ userId: created.id }).onConflictDoNothing()
      return box
    })
  } catch {
    // Roll back the auth user so no orphaned account/session remains and the
    // customer can retry with the same email.
    await db.delete(sessionTable).where(eq(sessionTable.userId, created.id))
    await db.delete(account).where(eq(account.userId, created.id))
    await db.delete(user).where(eq(user.id, created.id))
    return { error: "No pudimos completar tu registro. Intentá nuevamente." }
  }

  // Best-effort audit; never block the redirect on it.
  try {
    await recordAudit({
      actorUserId: created.id,
      actorName: `${firstName} ${lastName}`,
      action: "CUSTOMER_REGISTERED",
      entityType: "user",
      entityId: created.id,
      metadata: { boxNumber },
    })
  } catch {
    // ignore audit failures
  }

  // 3) Redirect on the SERVER so the freshly-set session cookie is sent with the
  //    redirect response and /panel loads authenticated in one hop. Must stay
  //    OUTSIDE any try/catch so the NEXT_REDIRECT is not suppressed.
  redirect("/panel?welcome=1")
}

export async function signOutAction() {
  // Admin sign-out. Clears the ADMIN-scope cookie (`us1_admin`) only, leaving any
  // customer session in the same browser untouched. The nextCookies() plugin
  // flushes the Set-Cookie into this server-action response, so the browser
  // drops the admin session immediately. Then bounce to the admin login, which
  // the layout guard also blocks for unauthenticated users.
  try {
    await authAdmin.api.signOut({ headers: await headers() })
  } catch {
    // Session may already be gone; proceed to redirect regardless.
  }
  redirect("/admin/login")
}
