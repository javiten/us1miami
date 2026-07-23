import Link from "next/link"
import { requireCustomer } from "@/lib/session"
import { getCustomerInvoices } from "@/lib/queries/invoices"
import { PageHeader, Card, EmptyState } from "@/components/portal/ui"
import { invoiceStatusLabel, invoiceStatusTone, effectiveInvoiceStatus } from "@/lib/invoices"
import { money } from "@/lib/format"

export default async function CustomerInvoicesPage() {
  const user = await requireCustomer()
  const invs = await getCustomerInvoices(user.id)

  return (
    <div>
      <PageHeader
        title="Facturas"
        description="Costos de envío de tus consolidaciones. Pagá para habilitar el despacho a Argentina."
      />

      {invs.length === 0 ? (
        <EmptyState
          icon="Receipt"
          title="Todavía no tenés facturas"
          description="Cuando US1 Miami consolide tus paquetes, vas a ver acá el costo de envío para pagar."
        />
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-border">
            {invs.map(({ invoice: inv, cwrNumber }) => {
              const effStatus = effectiveInvoiceStatus(inv)
              const needsPayment =
                inv.status === "OPEN" || inv.status === "PENDING_MANUAL_PAYMENT" || inv.status === "REQUIRES_REVIEW"
              return (
                <li key={inv.id} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-navy">{inv.invoiceNumber}</span>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${invoiceStatusTone(effStatus)}`}
                      >
                        {invoiceStatusLabel(effStatus)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {cwrNumber ?? "Consolidación"} · {Number(inv.billableWeightKg ?? 0).toFixed(2)} kg facturables
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-base font-bold text-navy">
                      {inv.subtotal != null ? money(inv.subtotal) : "A definir"}
                    </span>
                    {needsPayment && (
                      <Link
                        href={`/panel/facturas/${inv.consolidationId}`}
                        className="rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                      >
                        {inv.status === "REQUIRES_REVIEW" ? "Ver" : "Pagar"}
                      </Link>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      )}
    </div>
  )
}
