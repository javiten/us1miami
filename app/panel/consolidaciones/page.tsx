import Link from "next/link"
import { requireCustomer } from "@/lib/session"
import { getCustomerPackages, getCustomerConsolidations } from "@/lib/queries/customer"
import { getCustomerInvoices } from "@/lib/queries/invoices"
import { PageHeader, Card } from "@/components/portal/ui"
import { ConsolidationForm } from "@/components/portal/consolidation-form"
import { UndoRequestButton } from "@/components/portal/undo-request-button"
import { CONSOLIDATION_STATUS } from "@/lib/constants"
import { invoiceStatusLabel, invoiceStatusTone, effectiveInvoiceStatus } from "@/lib/invoices"
import { money } from "@/lib/format"

export default async function ConsolidationsPage() {
  const user = await requireCustomer()
  const [pkgs, cons, invs] = await Promise.all([
    getCustomerPackages(user.id),
    getCustomerConsolidations(user.id),
    getCustomerInvoices(user.id),
  ])
  const available = pkgs.filter((p) => p.status === "RECEIVED" || p.status === "PROCESSED")
  const invByCons = new Map(invs.map((i) => [i.invoice.consolidationId, i.invoice]))

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
                const inv = invByCons.get(c.id)
                const effStatus = inv ? effectiveInvoiceStatus(inv) : null
                const needsPayment =
                  inv && (inv.status === "OPEN" || inv.status === "PENDING_MANUAL_PAYMENT" || inv.status === "REQUIRES_REVIEW")
                return (
                  <li key={c.id} className="rounded-xl border border-border p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-navy">{c.cwrNumber || `Solicitud #${c.id}`}</span>
                      <span className="text-xs font-medium text-primary">
                        {CONSOLIDATION_STATUS[c.status as keyof typeof CONSOLIDATION_STATUS] ?? c.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {ids.length} paquete{ids.length === 1 ? "" : "s"}
                    </p>
                    {c.status === "REQUESTED" && <UndoRequestButton consolidationId={c.id} />}
                    {c.status === "UNDO_REQUESTED" && (
                      <p className="mt-2.5 text-xs font-medium text-orange-600">
                        Pediste la baja de esta solicitud. Un asesor la está revisando.
                      </p>
                    )}
                    {inv && effStatus && (
                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${invoiceStatusTone(effStatus)}`}
                        >
                          {invoiceStatusLabel(effStatus)}
                          {inv.subtotal != null ? ` · ${money(inv.subtotal)}` : ""}
                        </span>
                        {needsPayment && (
                          <Link
                            href={`/panel/facturas/${c.id}`}
                            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                          >
                            {inv.status === "REQUIRES_REVIEW" ? "Ver factura" : "Pagar envío"}
                          </Link>
                        )}
                      </div>
                    )}
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
