import { requireCustomer } from "@/lib/session"
import { getCustomerPrealerts } from "@/lib/queries/customer"
import { PageHeader, Card, StatusBadge } from "@/components/portal/ui"
import { PrealertForm } from "@/components/portal/prealert-form"

export default async function PrealertarPage() {
  const user = await requireCustomer()
  const prealerts = await getCustomerPrealerts(user.id)

  return (
    <div>
      <PageHeader
        title="Prealertar paquete"
        description="Avisanos qué compraste para que podamos identificar tu paquete apenas llegue a Miami."
      />
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <PrealertForm />
        </Card>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-navy">Prealertas recientes</h2>
          {prealerts.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
              Todavía no prealertaste ningún paquete.
            </p>
          ) : (
            <div className="space-y-3">
              {prealerts.map((p) => (
                <div key={p.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-navy">{p.store}</p>
                    <StatusBadge status={p.status === "MATCHED" ? "RECEIVED" : "EXPECTED"} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.description || "Sin descripción"}
                    {p.trackingNumber ? ` · ${p.trackingNumber}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
