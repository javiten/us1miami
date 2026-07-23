import { getAllPackages } from "@/lib/queries/admin"
import { requirePermission } from "@/lib/session"
import { PageHeader, StatusBadge } from "@/components/portal/ui"
import { PACKAGE_STATUS } from "@/lib/constants"
import Link from "next/link"

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  await requirePermission("warehouse.records")
  const { status } = await searchParams
  const rows = await getAllPackages(status)

  const filters = [
    { label: "Todos", value: "" },
    ...Object.entries(PACKAGE_STATUS).map(([value, label]) => ({ label, value })),
  ]

  return (
    <div>
      <PageHeader title="Paquetes" description="Todos los paquetes recibidos y esperados en el depósito de Miami." />

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = (status ?? "") === f.value
          return (
            <Link
              key={f.value || "all"}
              href={f.value ? `/admin/paquetes?status=${f.value}` : "/admin/paquetes"}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </Link>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">WR</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Casilla</th>
              <th className="px-4 py-3 font-medium">Descripción</th>
              <th className="px-4 py-3 font-medium">Peso</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Recibido</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No hay paquetes para este filtro.
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{p.wrNumber ?? "—"}</td>
                  <td className="px-4 py-3">
                    {p.userId ? (
                      <Link href={`/admin/clientes/${p.userId}`} className="text-primary hover:underline">
                        {p.customerName ?? "—"}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.boxNumber ?? "—"}</td>
                  <td className="px-4 py-3 text-foreground">{p.description ?? p.store ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.weightLb ? `${p.weightLb} lb` : "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.receivedAt ? new Date(p.receivedAt).toLocaleDateString("es-AR") : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
