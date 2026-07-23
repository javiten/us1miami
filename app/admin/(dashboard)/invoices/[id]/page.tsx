import { notFound } from "next/navigation"
import Link from "next/link"
import { requirePermission } from "@/lib/session"
import { hasPermission } from "@/lib/rbac"
import { getInvoiceDetail } from "@/lib/queries/invoices"
import { InvoiceActionsPanel } from "@/components/admin/invoice-actions-panel"
import { PrintButton } from "@/components/admin/print-button"
import {
  invoiceStatusLabel,
  invoiceStatusTone,
  effectiveInvoiceStatus,
  paymentMethodLabel,
} from "@/lib/invoices"
import { money } from "@/lib/format"
import { CONSOLIDATION_STATUS } from "@/lib/constants"

export default async function AdminInvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requirePermission("invoices.view")
  const canManage = hasPermission(admin.adminRoles, "invoices.manage")
  const { id } = await params
  const invoiceId = Number(id)
  if (!Number.isFinite(invoiceId)) notFound()

  const detail = await getInvoiceDetail(invoiceId)
  if (!detail) notFound()

  const inv = detail.invoice
  const eff = effectiveInvoiceStatus(inv)
  const kg = (v: string | null) => (v != null ? `${Number(v).toFixed(2)} kg` : "—")

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 print:py-0">
      <div className="mb-5 flex items-center justify-between print:hidden">
        <div>
          <Link href="/admin/invoices" className="text-sm text-muted-foreground hover:text-foreground">
            {"← Facturas"}
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{inv.invoiceNumber}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${invoiceStatusTone(eff)}`}>
            {invoiceStatusLabel(eff)}
          </span>
          <PrintButton />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Invoice document */}
        <div className="lg:col-span-2 space-y-5">
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Facturado a</p>
                <p className="mt-1 font-semibold text-foreground">{detail.customerName}</p>
                <p className="text-sm text-muted-foreground">{detail.boxNumber}</p>
                <p className="text-sm text-muted-foreground">{detail.customerEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Consolidado</p>
                <Link
                  href={`/admin/cwr/${detail.cwr?.cwrNumber}/label`}
                  className="mt-1 block font-semibold text-primary hover:underline print:text-foreground"
                >
                  {detail.cwr?.cwrNumber}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {detail.cwr
                    ? (CONSOLIDATION_STATUS[detail.cwr.status as keyof typeof CONSOLIDATION_STATUS] ?? detail.cwr.status)
                    : "—"}
                </p>
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2.5 text-muted-foreground">Peso real</td>
                    <td className="px-4 py-2.5 text-right font-medium text-foreground">{kg(inv.actualWeightKg)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-muted-foreground">Peso volumétrico</td>
                    <td className="px-4 py-2.5 text-right font-medium text-foreground">{kg(inv.volumetricWeightKg)}</td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="px-4 py-2.5 font-semibold text-foreground">Peso facturable</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-foreground">{kg(inv.billableWeightKg)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-muted-foreground">Tarifa por kg</td>
                    <td className="px-4 py-2.5 text-right font-medium text-foreground">
                      {inv.ratePerKg != null ? money(inv.ratePerKg) : "Pendiente de revisión"}
                    </td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td className="px-4 py-3 text-base font-bold text-foreground">Total</td>
                    <td className="px-4 py-3 text-right text-base font-bold text-foreground">
                      {inv.subtotal != null ? money(inv.subtotal) : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Método de pago</p>
                <p className="mt-0.5 font-medium text-foreground">{paymentMethodLabel(inv.paymentMethod)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Pagado</p>
                <p className="mt-0.5 font-medium text-foreground">
                  {inv.paidAt ? new Date(inv.paidAt).toLocaleString("es-AR") : "—"}
                </p>
              </div>
              {inv.paymentReference && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Referencia</p>
                  <p className="mt-0.5 font-medium text-foreground">{inv.paymentReference}</p>
                </div>
              )}
              {inv.confirmedByName && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Confirmado por</p>
                  <p className="mt-0.5 font-medium text-foreground">{inv.confirmedByName}</p>
                </div>
              )}
            </div>
          </section>

          {/* Member WRs */}
          <section className="rounded-xl border border-border bg-card p-5 print:break-inside-avoid">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              WR incluidos ({detail.members.length})
            </h2>
            <ul className="divide-y divide-border text-sm">
              {detail.members.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-2">
                  <span className="font-medium text-foreground">{m.wrNumber}</span>
                  <span className="text-muted-foreground">{m.description || "Sin descripción"}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Audit trail */}
          <section className="rounded-xl border border-border bg-card p-5 print:hidden">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Historial</h2>
            {detail.trail.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin eventos registrados.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {detail.trail.map((t) => (
                  <li key={t.id} className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-medium text-foreground">{t.action}</span>
                      {t.actorName && <span className="text-muted-foreground"> · {t.actorName}</span>}
                    </div>
                    <span className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(t.createdAt).toLocaleString("es-AR")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Admin actions */}
        <div className="print:hidden">
          {canManage ? (
            <InvoiceActionsPanel
              invoiceId={inv.id}
              status={inv.status}
              paymentMethod={inv.paymentMethod}
              billableWeightKg={inv.billableWeightKg}
            />
          ) : (
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              No tenés permisos para gestionar esta factura.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
