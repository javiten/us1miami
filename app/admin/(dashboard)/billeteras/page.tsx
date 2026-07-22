import { requireAdmin } from "@/lib/session"
import { db } from "@/lib/db"
import { wallet, walletTransaction, user } from "@/lib/db/schema"
import { desc, eq, sql } from "drizzle-orm"
import { PageHeader, StatCard, Card } from "@/components/portal/ui"
import { money } from "@/lib/format"
import { WALLET_TX_LABELS } from "@/lib/constants"
import Link from "next/link"

export default async function AdminWalletsPage() {
  await requireAdmin(["FINANCE", "SUPER_ADMIN"])

  const [agg] = await db
    .select({
      available: sql<string>`coalesce(sum(${wallet.availableBalance}), 0)`,
      pending: sql<string>`coalesce(sum(${wallet.pendingBalance}), 0)`,
      count: sql<number>`count(*)`,
    })
    .from(wallet)

  const recent = await db
    .select({
      id: walletTransaction.id,
      type: walletTransaction.type,
      amount: walletTransaction.amount,
      description: walletTransaction.description,
      createdAt: walletTransaction.createdAt,
      userId: walletTransaction.userId,
      customerName: user.name,
    })
    .from(walletTransaction)
    .leftJoin(user, eq(user.id, walletTransaction.userId))
    .orderBy(desc(walletTransaction.createdAt))
    .limit(40)

  return (
    <div>
      <PageHeader title="Billeteras" description="Saldos de clientes y movimientos recientes del sistema." />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Saldo disponible total" value={money(agg?.available)} icon="Wallet" tone="success" />
        <StatCard label="Saldo pendiente total" value={money(agg?.pending)} icon="Clock" tone="warning" />
        <StatCard label="Billeteras activas" value={Number(agg?.count ?? 0)} icon="Users" tone="primary" />
      </div>

      <Card className="p-0">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold text-navy">Movimientos recientes</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-6 py-3 font-medium">Cliente</th>
              <th className="px-6 py-3 font-medium">Tipo</th>
              <th className="px-6 py-3 font-medium">Detalle</th>
              <th className="px-6 py-3 text-right font-medium">Monto</th>
              <th className="px-6 py-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                  Aún no hay movimientos.
                </td>
              </tr>
            ) : (
              recent.map((t) => {
                const amt = Number(t.amount)
                const positive = amt >= 0
                return (
                  <tr key={t.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                    <td className="px-6 py-3">
                      {t.userId ? (
                        <Link href={`/admin/clientes/${t.userId}`} className="text-primary hover:underline">
                          {t.customerName ?? "—"}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {WALLET_TX_LABELS[t.type as keyof typeof WALLET_TX_LABELS] ?? t.type}
                    </td>
                    <td className="px-6 py-3 text-foreground">{t.description}</td>
                    <td
                      className={`px-6 py-3 text-right font-semibold ${positive ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {positive ? "+" : ""}
                      {money(amt)}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {new Date(t.createdAt).toLocaleDateString("es-AR")}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
