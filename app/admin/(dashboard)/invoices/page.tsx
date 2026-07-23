import Link from "next/link"
import { requirePermission } from "@/lib/session"
import { getInvoiceCounters, getInvoicesForAdmin } from "@/lib/queries/invoices"
import { PageHeader, StatCard, Card } from "@/components/portal/ui"
import { money } from "@/lib/format"
import { invoiceStatusLabel, invoiceStatusTone, effectiveInvoiceStatus, paymentMethodLabel } from "@/lib/invoices"

const FILTERS: { key: string; label: string }[] = [
  { key: "ALL", label: "Todas" },
  { key: "OPEN", label: "Pendientes" },
  { key: "PENDING_MANUAL_PAYMENT", label: "En verificación" },
  { key: "REQUIRES_REVIEW", label: "Requieren revisión" },
  { key: "OVERDUE", label: "Vencidas" },
  { key: "PAID", label: "Pagadas" },
  { key: "CANCELLED", label: "Canceladas" },
]

export default async function AdminInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  await requirePermission("invoices.view")
  const sp = await searchParams
  const status = sp.status ?? "ALL"
  const search = sp.q?.trim() || undefined

  const [counters, rows] = await Promise.all([
    getInvoiceCounters(),
    getInvoicesForAdmin({ status, search }),
  ])

  function filterHref(key: string) {
    const params = new URLSearchParams()
    if (key !== "ALL") params.set("status", key)
    if (search) params.set("q", search)
    const qs = params.toString()
    return qs ? `/admin/invoices?${qs}` : "/admin/invoices"
  }

  return (
    <div>
      <PageHeader
        title="Facturas de envío"
        description="Costos de envío generados al consolidar. Verificá pagos manuales, resolvé revisiones y seguí la cobranza."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Por cobrar" value={money(counters?.outstanding)} icon="CircleDollarSign" tone="warning" hint={`${Number(counters?.open ?? 0)} pendientes · ${Number(counters?.manual ?? 0)} en verificación`} />
        <StatCard label="Cobrado" value={money(counters?.collected)} icon="CheckCircle2" tone="success" hint={`${Number(counters?.paid ?? 0)} facturas pagadas`} />
        <StatCard label="Requieren revisión" value={Number(counters?.review ?? 0)} icon="AlertTriangle" tone="primary" hint="Envíos de más de 20 kg" />
        <StatCard label="Vencidas" value={Number(counters?.overdue ?? 0)} icon="Clock" tone="default" hint="Impagas fuera de término" />
      </div>

      <Card className="p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const active = status === f.key
              return (
                <Link
                  key={f.key}
                  href={filterHref(f.key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-navy/70 hover:bg-border"
                  }`}
                >
                  {f.label}
                </Link>
              )
            })}
          </div>
          <form action="/admin/invoices" className="ml-auto flex items-center gap-2">
            {status !== "ALL" && <input type="hidden" name="status" value={status} />}
            <input
              type="search"
              name="q"
              defaultValue={search ?? ""}
              placeholder="Buscar factura, CWR o cliente…"
              className="w-56 rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Factura</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">CWR</th>
                <th className="px-5 py-3 text-right font-medium">Facturable</th>
                <th className="px-5 py-3 text-right font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Método</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    No hay facturas para este filtro.
                  </td>
                </tr>
              ) : (
                rows.map(({ invoice: inv, cwrNumber, customerName, boxNumber }) => {
                  const effStatus = effectiveInvoiceStatus(inv)
                  return (
                    <tr key={inv.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                      <td className="px-5 py-3 font-semibold text-navy">{inv.invoiceNumber}</td>
                      <td className="px-5 py-3">
                        <span className="text-navy">{customerName ?? "—"}</span>
                        {boxNumber && <span className="ml-1 text-xs text-muted-foreground">({boxNumber})</span>}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{cwrNumber ?? "—"}</td>
                      <td className="px-5 py-3 text-right text-muted-foreground">
                        {Number(inv.billableWeightKg ?? 0).toFixed(2)} kg
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-navy">
                        {inv.subtotal != null ? money(inv.subtotal) : "—"}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{paymentMethodLabel(inv.paymentMethod)}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${invoiceStatusTone(effStatus)}`}
                        >
                          {invoiceStatusLabel(effStatus)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/admin/invoices/${inv.id}`} className="text-primary hover:underline">
                          Ver
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
