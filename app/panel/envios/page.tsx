import { requireCustomer } from "@/lib/session"
import { getCustomerConsolidations } from "@/lib/queries/customer"
import { PageHeader, Card, EmptyState } from "@/components/portal/ui"
import { CONSOLIDATION_STATUS } from "@/lib/constants"
import * as Icons from "lucide-react"

export const metadata = { title: "Mis envíos — US1 Miami" }

// Ordered shipment lifecycle used to render the tracking timeline. Terminal
// states (DECONSOLIDATED / CANCELLED) fall outside the happy path and are shown
// only as a status badge.
const SHIPMENT_STEPS: { key: string; label: string }[] = [
  { key: "REQUESTED", label: "Solicitada" },
  { key: "IN_PROGRESS", label: "En preparación" },
  { key: "PENDING_PAYMENT", label: "Pago requerido" },
  { key: "READY_TO_SHIP", label: "Lista para envío" },
  { key: "CONSOLIDATED_IN_MC", label: "En carga maestra" },
  { key: "IN_TRANSIT", label: "En tránsito" },
  { key: "RECEIVED_ARGENTINA", label: "Recibida en Argentina" },
  { key: "COMPLETED", label: "Completada" },
]

function stepIndexFor(status: string): number {
  // SHIPPED is an alias for the final leg; map it onto COMPLETED.
  if (status === "SHIPPED") return SHIPMENT_STEPS.findIndex((s) => s.key === "COMPLETED")
  return SHIPMENT_STEPS.findIndex((s) => s.key === status)
}

function statusTone(status: string): string {
  switch (status) {
    case "COMPLETED":
    case "SHIPPED":
    case "RECEIVED_ARGENTINA":
      return "bg-emerald-50 text-emerald-600"
    case "IN_TRANSIT":
    case "CONSOLIDATED_IN_MC":
      return "bg-indigo-50 text-indigo-600"
    case "PENDING_PAYMENT":
      return "bg-amber-50 text-amber-600"
    case "CANCELLED":
    case "DECONSOLIDATED":
      return "bg-rose-50 text-rose-600"
    default:
      return "bg-slate-100 text-slate-600"
  }
}

export default async function ShipmentsPage() {
  const user = await requireCustomer()
  const shipments = await getCustomerConsolidations(user.id)

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Mis envíos"
        description="Seguí el estado de tus consolidaciones y envíos hacia Argentina."
      />

      {shipments.length === 0 ? (
        <EmptyState
          icon="Plane"
          title="Todavía no tenés envíos"
          description="Cuando prepares una consolidación desde la sección Consolidaciones, vas a poder seguir su recorrido acá."
        />
      ) : (
        <div className="space-y-5">
          {shipments.map((s) => {
            const ids = Array.isArray(s.packageIds) ? (s.packageIds as number[]) : []
            const label = (CONSOLIDATION_STATUS as Record<string, string>)[s.status] ?? s.status
            const activeIdx = stepIndexFor(s.status)
            const isTerminalOff = s.status === "CANCELLED" || s.status === "DECONSOLIDATED"
            return (
              <Card key={s.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-navy">{s.cwrNumber || `Solicitud #${s.id}`}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {ids.length} paquete{ids.length === 1 ? "" : "s"}
                      {s.weightLb ? ` · ${s.weightLb} lb` : ""}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(s.status)}`}
                  >
                    {label}
                  </span>
                </div>

                {!isTerminalOff && activeIdx >= 0 && (
                  <ol className="mt-5 flex flex-wrap gap-y-4">
                    {SHIPMENT_STEPS.map((step, i) => {
                      const done = i <= activeIdx
                      const isCurrent = i === activeIdx
                      return (
                        <li key={step.key} className="flex min-w-[7.5rem] flex-1 flex-col items-center text-center">
                          <div className="flex w-full items-center">
                            <span className={`h-0.5 flex-1 ${i === 0 ? "bg-transparent" : done ? "bg-primary" : "bg-border"}`} />
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                                done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-transparent"
                              }`}
                            >
                              {done && <Icons.Check className="h-3 w-3" />}
                            </span>
                            <span
                              className={`h-0.5 flex-1 ${
                                i === SHIPMENT_STEPS.length - 1 ? "bg-transparent" : i < activeIdx ? "bg-primary" : "bg-border"
                              }`}
                            />
                          </div>
                          <span className={`mt-1.5 px-1 text-[11px] leading-tight ${isCurrent ? "font-semibold text-navy" : done ? "text-navy/70" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                        </li>
                      )
                    })}
                  </ol>
                )}

                {s.notes && (
                  <p className="mt-4 rounded-xl bg-muted px-3.5 py-2.5 text-xs text-muted-foreground">
                    <span className="font-medium text-navy">Instrucciones: </span>
                    {s.notes}
                  </p>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
