import { getAllPackages, getPackageStatusCounts, getCustomersList } from "@/lib/queries/admin"
import { requirePermission } from "@/lib/session"
import { hasPermission } from "@/lib/rbac"
import { PageHeader } from "@/components/portal/ui"
import { PackagesTable } from "@/components/admin/packages-table"

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const admin = await requirePermission("packages.view")
  const { status = "", q = "" } = await searchParams

  const [rows, counts, customers] = await Promise.all([
    getAllPackages(status || undefined, q || undefined),
    getPackageStatusCounts(),
    hasPermission(admin.adminRoles, "box.reassign") ? getCustomersList() : Promise.resolve([]),
  ])

  const perms = {
    edit: hasPermission(admin.adminRoles, "packages.edit"),
    transition: hasPermission(admin.adminRoles, "packages.transition"),
    notes: hasPermission(admin.adminRoles, "packages.notes"),
    reassign: hasPermission(admin.adminRoles, "box.reassign"),
    labels: hasPermission(admin.adminRoles, "labels.print"),
  }

  return (
    <div>
      <PageHeader title="Paquetes" description="Todos los paquetes recibidos y esperados en el depósito de Miami." />
      <PackagesTable
        rows={rows}
        counts={counts}
        status={status}
        search={q}
        perms={perms}
        customers={customers.map((c) => ({ id: c.id, name: c.name, boxNumber: c.boxNumber }))}
      />
    </div>
  )
}
