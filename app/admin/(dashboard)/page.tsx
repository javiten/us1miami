import Link from "next/link"
import { requireAdmin } from "@/lib/session"
import { getAdminDashboard } from "@/lib/queries/admin"
import { PageHeader, StatCard, Card, StatusBadge } from "@/components/portal/ui"
import { money } from "@/lib/format"

export const metadata = { title: "Dashboard — Admin US1 Miami" }

export default async function AdminDashboardPage() {
  await requireAdmin()
  const data = await getAdminDashboard()

  return (
    <div>
      <PageHeader title="Panel operativo" description="Vista general de la operación de US1 Miami en tiempo real." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Clientes activos" value={Number(data.customers.total)} icon="Users" tone="primary" />
        <StatCard
          label="Recibidos hoy"
          value={Number(data.packages.today)}
          icon="PackageCheck"
          tone="success"
          hint={`${Number(data.packages.total)} paquetes en total`}
        />
        <StatCard label="En depósito" value={Number(data.packages.inWarehouse)} icon="Warehouse" tone="warning" />
        <StatCard
          label="Saldo total en billeteras"
          value={money(data.wallet.available)}
          icon="Wallet"
          hint={`${money(data.wallet.pending)} retenido`}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pre-alertados" value={Number(data.packages.expected)} icon="BellRing" />
        <StatCard label="Recibidos (sin asignar)" value={Number(data.packages.received)} icon="Inbox" />
        <StatCard label="En tránsito" value={Number(data.packages.inTransit)} icon="Plane" />
        <StatCard label="Consolidaciones abiertas" value={Number(data.consolidations.open)} icon="Combine" />
      </div>

      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy">Últimos movimientos de paquetes</h2>
          <Link href="/admin/paquetes" className="text-sm font-medium text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        {data.recentPackages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no hay paquetes registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-2.5 font-semibold">WR</th>
                  <th className="pb-2.5 font-semibold">Box</th>
                  <th className="pb-2.5 font-semibold">Descripción</th>
                  <th className="pb-2.5 font-semibold">Estado</th>
                  <th className="pb-2.5 text-right font-semibold">Peso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.recentPackages.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 font-medium text-navy">{p.wrNumber ?? "—"}</td>
                    <td className="py-2.5 text-muted-foreground">{p.boxNumber ?? "—"}</td>
                    <td className="py-2.5 text-muted-foreground">{p.description ?? "Sin descripción"}</td>
                    <td className="py-2.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground">
                      {p.weightLb ? `${p.weightLb} lb` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
