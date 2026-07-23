import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { AdminShell } from "@/components/admin/admin-shell"
import { ADMIN_ROLE_LABELS, permissionsFor, type AdminRole } from "@/lib/rbac"

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()
  if (!user || user.role !== "ADMIN") redirect("/admin/login")

  const roles = user.adminRoles as AdminRole[]
  const permissions = [...permissionsFor(roles.length ? roles : ["SUPER_ADMIN"])]
  const roleLabels = roles.map((r) => ADMIN_ROLE_LABELS[r]).join(" · ") || "Administrador"

  return (
    <AdminShell user={{ name: user.name, email: user.email, roleLabels }} permissions={permissions}>
      {children}
    </AdminShell>
  )
}
