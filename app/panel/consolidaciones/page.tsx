import { requireCustomer } from "@/lib/session"
import { getCustomerPackages, getCustomerConsolidations } from "@/lib/queries/customer"
import { PageHeader, Card } from "@/components/portal/ui"
import { ConsolidationForm } from "@/components/portal/consolidation-form"
import { CONSOLIDATION_STATUS } from "@/lib/constants"

export default async function ConsolidationsPage() {
  const user = await requireCustomer()
  const [pkgs, cons] = await Promise.all([
    getCustomerPackages(user.id),
    getCustomerConsolidations(user.id),
  ])
  const available = pkgs.filter((p) => p.status === "IN_WAREHOUSE")

  return (
    <div>
      <PageHeader
        title="Consolidaciones"
        description="Combiná varios paquetes en un solo envío a Argentina y ahorrá en el costo por kilo."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-navy">Nueva consolidación</h2>
          <ConsolidationForm
            available={available.map((p) => ({
              id: p.id,
              description: p.description,
              store: p.store,
              wrNumber: p.wrNumber,
              weightLb: p.weightLb,
              declaredValue: p.declaredValue,
            }))}
          />
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-semibold text-navy">Historial</h2>
          {cons.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no solicitaste ninguna consolidación.</p>
          ) : (
            <ul className="space-y-3">
              {cons.map((c) => {
                const ids = Array.isArray(c.packageIds) ? (c.packageIds as number[]) : []
                return (
                  <li key={c.id} className="rounded-xl border border-border p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-navy">{c.cwrNumber || `Solicitud #${c.id}`}</span>
                      <span className="text-xs font-medium text-primary">
                        {CONSOLIDATION_STATUS[c.status as keyof typeof CONSOLIDATION_STATUS] ?? c.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{ids.length} paquetes</p>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
