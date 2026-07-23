import Link from "next/link"
import { notFound } from "next/navigation"
import * as Icons from "lucide-react"
import { requirePermission, getSessionUser } from "@/lib/session"
import { getCustomerDetail } from "@/lib/queries/admin"
import { hasPermission, type AdminRole } from "@/lib/rbac"
import { Card, StatusBadge } from "@/components/portal/ui"
import { WalletAdjustForm } from "@/components/admin/wallet-adjust-form"
import { money } from "@/lib/format"

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("customers.view")
  const sessionUser = await getSessionUser()
  const canAdjust = hasPermission((sessionUser?.adminRoles ?? []) as AdminRole[], "wallets.adjust")

  const { id } = await params
  const detail = await getCustomerDetail(id)
  if (!detail) notFound()

  const { user, profile, wallet, packages, transactions } = detail

  return (
    <div>
      <Link href="/admin/clientes" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-navy">
        <Icons.ChevronLeft className="h-4 w-4" />
        Volver a clientes
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">{user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
          Box {user.boxNumber}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-base font-semibold text-navy">Datos de entrega en Argentina</h2>
            {profile ? (
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <Info label="Nombre" value={`${profile.firstName} ${profile.lastName}`} />
                <Info label="Teléfono" value={user.phone ?? "—"} />
                <Info
                  label="Dirección"
                  value={`${profile.street ?? ""} ${profile.streetNumber ?? ""}${
                    profile.floor ? `, Piso ${profile.floor}` : ""
                  }${profile.apartment ? ` Dto ${profile.apartment}` : ""}`}
                />
                <Info label="Ciudad" value={`${profile.city ?? "—"}, ${profile.province ?? ""}`} />
                <Info label="Código postal" value={profile.postalCode ?? "—"} />
                <Info label="Referencias" value={profile.references ?? "—"} />
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">El cliente aún no completó su perfil.</p>
            )}
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-semibold text-navy">Paquetes ({packages.length})</h2>
            {packages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin paquetes registrados.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="pb-2 font-semibold">WR</th>
                      <th className="pb-2 font-semibold">Descripción</th>
                      <th className="pb-2 font-semibold">Estado</th>
                      <th className="pb-2 text-right font-semibold">Peso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {packages.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2 font-medium text-navy">{p.wrNumber ?? "—"}</td>
                        <td className="py-2 text-muted-foreground">{p.description ?? "—"}</td>
                        <td className="py-2">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="py-2 text-right text-muted-foreground">{p.weightLb ? `${p.weightLb} lb` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-base font-semibold text-navy">Billetera</h2>
            <p className="text-3xl font-bold text-navy">{money(wallet?.availableBalance)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{money(wallet?.pendingBalance)} retenido</p>
            {canAdjust && (
              <div className="mt-5 border-t border-border pt-5">
                <h3 className="mb-3 text-sm font-semibold text-navy">Ajuste manual</h3>
                <WalletAdjustForm userId={user.id} />
              </div>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 text-base font-semibold text-navy">Movimientos recientes</h2>
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin movimientos.</p>
            ) : (
              <ul className="space-y-2.5">
                {transactions.map((t) => {
                  const positive = ["CREDIT", "RELEASE", "REFUND"].includes(t.type)
                  return (
                    <li key={t.id} className="flex items-center justify-between text-sm">
                      <span className="truncate pr-2 text-muted-foreground">{t.description}</span>
                      <span className={positive ? "font-semibold text-emerald-600" : "font-semibold text-navy"}>
                        {positive ? "+" : "-"}
                        {money(Math.abs(Number(t.amount)))}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium text-navy">{value}</dd>
    </div>
  )
}
