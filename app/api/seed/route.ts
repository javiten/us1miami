import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db, pool } from "@/lib/db"
import { user, wallet } from "@/lib/db/schema"
import { nextCounter, formatBoxNumber } from "@/lib/counters"

// One-off seed for demo admin accounts. Idempotent: safe to call repeatedly.
// Admins sign in with a username that maps to an internal email.
const ADMIN_DOMAIN = "us1miami.internal"

const ADMINS = [
  {
    username: "javiten",
    name: "Javier (Super Admin)",
    password: "boludo33179",
    adminRoles: ["SUPER_ADMIN"],
  },
  {
    username: "juan",
    name: "Juan (Operaciones / Soporte)",
    password: "boludo33179",
    adminRoles: ["OPERATIONS", "CUSTOMER_SUPPORT"],
  },
]

export async function POST() {
  const results: string[] = []

  for (const admin of ADMINS) {
    const email = `${admin.username}@${ADMIN_DOMAIN}`
    const existing = await db.select().from(user).where(eq(user.email, email)).limit(1)
    if (existing.length > 0) {
      results.push(`${admin.username}: already exists`)
      continue
    }

    // Create via Better Auth so the password hash is compatible with sign-in.
    await auth.api.signUpEmail({
      body: { email, password: admin.password, name: admin.name },
    })

    // Promote to admin with roles + require password change on first login.
    await db
      .update(user)
      .set({
        role: "ADMIN",
        adminRoles: admin.adminRoles,
        mustChangePassword: true,
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(user.email, email))

    results.push(`${admin.username}: created`)
  }

  // Seed one demo customer with a package for a realistic dashboard.
  const demoEmail = "cliente@demo.com"
  const demoExisting = await db.select().from(user).where(eq(user.email, demoEmail)).limit(1)
  if (demoExisting.length === 0) {
    await auth.api.signUpEmail({
      body: { email: demoEmail, password: "cliente1234", name: "María González" },
    })
    const boxNum = formatBoxNumber(await nextCounter("box"))
    const rows = await db.select().from(user).where(eq(user.email, demoEmail)).limit(1)
    const uid = rows[0].id
    await db.update(user).set({ boxNumber: boxNum, phone: "+54 11 5555-1234" }).where(eq(user.id, uid))
    await db.insert(wallet).values({ userId: uid }).onConflictDoNothing()
    results.push(`demo customer: created (${boxNum})`)
  } else {
    results.push("demo customer: already exists")
  }

  await pool.query('SELECT 1')
  return NextResponse.json({ ok: true, results })
}
