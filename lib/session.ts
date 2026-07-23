import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { hasPermission, type AdminRole, type Permission } from "@/lib/rbac"

export type SessionUser = {
  id: string
  name: string
  email: string
  role: string
  adminRoles: AdminRole[]
  phone?: string | null
  boxNumber?: string | null
  mustChangePassword?: boolean
}

/** Returns the current session user, or null if unauthenticated. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const u = session.user as Record<string, unknown>
  return {
    id: u.id as string,
    name: u.name as string,
    email: u.email as string,
    role: (u.role as string) ?? "CUSTOMER",
    adminRoles: normalizeRoles(u.adminRoles),
    phone: (u.phone as string) ?? null,
    boxNumber: (u.boxNumber as string) ?? null,
    mustChangePassword: Boolean(u.mustChangePassword),
  }
}

function normalizeRoles(value: unknown): AdminRole[] {
  if (Array.isArray(value)) return value as AdminRole[]
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed as AdminRole[]
    } catch {
      return []
    }
  }
  return []
}

/**
 * Require an authenticated CUSTOMER for /panel routes.
 *
 * Customer and admin are separate login scopes: a session that is not a
 * customer (e.g. an admin-only session) does NOT satisfy this guard and is
 * sent to the customer login — never cross-redirected into /admin. This keeps
 * /panel protected by customer auth without leaking an admin session into the
 * customer portal.
 */
export async function requireCustomer(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user || user.role !== "CUSTOMER") redirect("/ingresar")
  return user
}

/** Require an authenticated admin. Redirects otherwise. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect("/admin/login")
  if (user.role !== "ADMIN") redirect("/admin/login")
  return user
}

/** Require an admin with a specific permission. */
export async function requirePermission(permission: Permission): Promise<SessionUser> {
  const user = await requireAdmin()
  if (!hasPermission(user.adminRoles, permission)) redirect("/admin?denied=1")
  return user
}
