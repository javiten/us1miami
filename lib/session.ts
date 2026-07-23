import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth, authAdmin } from "@/lib/auth"
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

type AuthInstance = typeof auth | typeof authAdmin

function toSessionUser(user: Record<string, unknown>): SessionUser {
  return {
    id: user.id as string,
    name: user.name as string,
    email: user.email as string,
    role: (user.role as string) ?? "CUSTOMER",
    adminRoles: normalizeRoles(user.adminRoles),
    phone: (user.phone as string) ?? null,
    boxNumber: (user.boxNumber as string) ?? null,
    mustChangePassword: Boolean(user.mustChangePassword),
  }
}

async function readSession(instance: AuthInstance): Promise<SessionUser | null> {
  const session = await instance.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return toSessionUser(session.user as Record<string, unknown>)
}

/** Read the CUSTOMER-scope session (the `better-auth` cookie via /api/auth). */
export async function getCustomerSessionUser(): Promise<SessionUser | null> {
  return readSession(auth)
}

/** Read the ADMIN-scope session (the `us1_admin` cookie via /api/auth-admin). */
export async function getAdminSessionUser(): Promise<SessionUser | null> {
  return readSession(authAdmin)
}

/**
 * Generic reader for endpoints that legitimately serve BOTH portals (e.g. the
 * warehouse file/photo proxies): returns whichever scope is signed in, admin
 * first. Prefer the scope-specific readers above for portal pages and guards.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  return (await getAdminSessionUser()) ?? (await getCustomerSessionUser())
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
  const user = await getCustomerSessionUser()
  if (!user || user.role !== "CUSTOMER") redirect("/ingresar")
  return user
}

/** Require an authenticated admin. Redirects otherwise. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getAdminSessionUser()
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
