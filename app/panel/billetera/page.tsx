import { requireCustomer } from "@/lib/session"
import { getCustomerWallet, getWalletTransactions, money } from "@/lib/queries/customer"
import { PageHeader, Card, StatCard } from "@/components/portal/ui"
import { DepositForm } from "@/components/portal/deposit-form"

const TX_LABELS: Record<string, string> = {
  CREDIT: "Carga de saldo",
  DEBIT: "Cargo",
  HOLD: "Retención",
  RELEASE: "Liberación",
  REFUND: "Reembolso",
}

export default async function WalletPage() {
  const user = await requireCustomer()
  const [w, txs] = await Promise.all([getCustomerWallet(user.id), getWalletTransactions(user.id)])

  return (
    <div>
      <PageHeader title="Mi billetera" description="Cargá saldo para pagar envíos, consolidaciones y servicios." />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Saldo disponible" value={money(w?.availableBalance)} icon="Wallet" tone="success" />
        <StatCard label="Saldo retenido" value={money(w?.pendingBalance)} icon="Clock" tone="warning" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-navy">Movimientos</h2>
          {txs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no tenés movimientos.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Fecha</th>
                    <th className="px-4 py-2.5 font-semibold">Concepto</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Monto</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {txs.map((t) => {
                    const amt = Number(t.amount)
                    const positive = ["CREDIT", "RELEASE", "REFUND"].includes(t.type)
                    return (
                      <tr key={t.id}>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {new Date(t.createdAt).toLocaleDateString("es-AR")}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="font-medium text-navy">{t.description}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{TX_LABELS[t.type] ?? t.type}</span>
                        </td>
                        <td
                          className={`px-4 py-2.5 text-right font-semibold ${positive ? "text-emerald-600" : "text-navy"}`}
                        >
                          {positive ? "+" : "-"}
                          {money(Math.abs(amt))}
                        </td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">{money(t.balanceAfter)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-semibold text-navy">Cargar saldo</h2>
          <DepositForm />
        </Card>
      </div>
    </div>
  )
}
