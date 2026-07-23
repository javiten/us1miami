import Link from "next/link"
import { notFound } from "next/navigation"
import * as Icons from "lucide-react"
import { requireCustomer } from "@/lib/session"
import { getCustomerInvoiceByConsolidation } from "@/lib/queries/invoices"
import { getCustomerWallet } from "@/lib/queries/customer"
import { PageHeader, Card } from "@/components/portal/ui"
import { InvoiceCheckout } from "@/components/portal/invoice-checkout"
import { money } from "@/lib/format"
import { invoiceStatusLabel, invoiceStatusTone, effectiveInvoiceStatus } from "@/lib/invoices"

export default async function InvoiceCheckoutPage({
  params,
}: {
  params: Promise<{ consolidationId: string }>
}) {
  const { consolidationId } = await params
  const id = Number(consolidationId)
  if (!Number.isFinite(id)) notFound()

  const user = await requireCustomer()
  const [data, walletRow] = await Promise.all([
    getCustomerInvoiceByConsolidation(user.id, id),
    getCustomerWallet(user.id),
  ])
  if (!data) notFound()

  const { invoice, cwr, members } = data
  const effStatus = effectiveInvoiceStatus(invoice)
  const walletBalance = Number(walletRow?.availableBalance ?? 0)
  const amount = invoice.subtotal != null ? Number(invoice.subtotal) : null

  return (
    <div>
      <PageHeader
        title={`Pago de envío · ${cwr?.cwrNumber ?? invoice.invoiceNumber}`}
        description="Elegí cómo querés pagar el costo de envío a Argentina. El despacho se habilita una vez confirmado el pago."
        action={
          <Link
            href="/panel/consolidaciones"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-navy"
          >
            <Icons.ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Invoice summary */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Factura</p>
              <p className="text-lg font-bold text-navy">{invoice.invoiceNumber}</p>
            </div>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${invoiceStatusTone(effStatus)}`}>
              {invoiceStatusLabel(effStatus)}
            </span>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <Row label="Peso real" value={`${Number(invoice.actualWeightKg ?? 0).toFixed(2)} kg`} />
            <Row label="Peso volumétrico" value={`${Number(invoice.volumetricWeightKg ?? 0).toFixed(2)} kg`} />
            <Row
              label="Peso facturable"
              value={`${Number(invoice.billableWeightKg ?? 0).toFixed(2)} kg`}
              strong
              hint="Se factura el mayor entre peso real y volumétrico."
            />
            <Row
              label="Tarifa por kg"
              value={invoice.ratePerKg != null ? money(invoice.ratePerKg) : "A definir"}
            />
            <div className="my-3 border-t border-border" />
            <div className="flex items-center justify-between">
              <dt className="text-base font-semibold text-navy">Total a pagar</dt>
              <dd className="text-2xl font-bold text-navy">{amount != null ? money(amount) : "—"}</dd>
            </div>
          </dl>

          {members.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {members.length} paquete{members.length > 1 ? "s" : ""} en este envío
              </p>
              <ul className="space-y-1.5">
                {members.map((p) => (
                  <li key={p.id} className="flex justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                    <span className="font-medium text-navy">{p.wrNumber}</span>
                    <span className="text-muted-foreground">{p.description || "Paquete"}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        {/* Payment methods */}
        <Card>
          <h2 className="mb-4 text-base font-semibold text-navy">Método de pago</h2>
          {amount == null ? (
            <p className="text-sm text-muted-foreground">
              Esta factura todavía no tiene un monto definido. Esperá la revisión de US1 Miami.
            </p>
          ) : (
            <InvoiceCheckout invoiceId={invoice.id} amount={amount} walletBalance={walletBalance} status={invoice.status} />
          )}
        </Card>
      </div>
    </div>
  )
}

function Row({ label, value, strong, hint }: { label: string; value: string; strong?: boolean; hint?: string }) {
  return (
    <div className="flex items-start justify-between">
      <dt className="text-muted-foreground">
        {label}
        {hint && <span className="mt-0.5 block text-xs text-muted-foreground/70">{hint}</span>}
      </dt>
      <dd className={strong ? "font-semibold text-navy" : "text-navy"}>{value}</dd>
    </div>
  )
}
