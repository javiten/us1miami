export type AppRole = "CUSTOMER" | "ADMIN"

export type AdminRole = "SUPER_ADMIN" | "OPERATIONS" | "CUSTOMER_SUPPORT"

export type Permission =
  | "dashboard.view"
  | "customers.view"
  | "customers.manage"
  | "inbound.view"
  | "warehouse.receive"
  | "warehouse.records"
  | "packages.view"
  | "packages.edit"
  | "packages.transition"
  | "packages.notes"
  | "box.reassign"
  | "consolidations.manage"
  | "outbound.manage"
  | "airwaybills.manage"
  | "manifests.manage"
  | "labels.print"
  | "wallets.view"
  | "wallets.adjust"
  | "payments.view"
  | "reports.view"
  | "reports.financial"
  | "settings.manage"
  | "admins.manage"
  | "roles.manage"
  | "audit.view"

const SUPER_ADMIN_PERMS: Permission[] = [
  "dashboard.view",
  "customers.view",
  "customers.manage",
  "inbound.view",
  "warehouse.receive",
  "warehouse.records",
  "packages.view",
  "packages.edit",
  "packages.transition",
  "packages.notes",
  "box.reassign",
  "consolidations.manage",
  "outbound.manage",
  "airwaybills.manage",
  "manifests.manage",
  "labels.print",
  "wallets.view",
  "wallets.adjust",
  "payments.view",
  "reports.view",
  "reports.financial",
  "settings.manage",
  "admins.manage",
  "roles.manage",
  "audit.view",
]

const OPERATIONS_PERMS: Permission[] = [
  "dashboard.view",
  "inbound.view",
  "warehouse.receive",
  "warehouse.records",
  "packages.view",
  "packages.edit",
  "packages.transition",
  "packages.notes",
  "consolidations.manage",
  "outbound.manage",
  "airwaybills.manage",
  "manifests.manage",
  "labels.print",
  "customers.view",
]

const CUSTOMER_SUPPORT_PERMS: Permission[] = [
  "dashboard.view",
  "customers.view",
  "customers.manage",
  "packages.view",
  "packages.notes",
  "inbound.view",
  "wallets.view",
]

const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  SUPER_ADMIN: SUPER_ADMIN_PERMS,
  OPERATIONS: OPERATIONS_PERMS,
  CUSTOMER_SUPPORT: CUSTOMER_SUPPORT_PERMS,
}

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Administrador",
  OPERATIONS: "Operaciones",
  CUSTOMER_SUPPORT: "Atención al Cliente",
}

/** Resolve the full permission set for a set of admin roles. */
export function permissionsFor(adminRoles: AdminRole[]): Set<Permission> {
  const perms = new Set<Permission>()
  for (const role of adminRoles) {
    for (const p of ROLE_PERMISSIONS[role] ?? []) perms.add(p)
  }
  return perms
}

export function hasPermission(adminRoles: AdminRole[], permission: Permission): boolean {
  if (adminRoles.includes("SUPER_ADMIN")) return true
  return permissionsFor(adminRoles).has(permission)
}
