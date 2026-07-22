import Link from "next/link"
import { ArrowRight, PartyPopper } from "lucide-react"
import { requireCustomer } from "@/lib/session"
import {
  getCustomerDashboard,
  getCustomerWallet,
  getCustomerProfile,
  money,
} from "@/lib/queries/customer"
import { PageHeader, StatCard, StatusBadge, Card, EmptyState } from "@/components/portal/ui"
import { AddressCard } from "@/components/portal/address-card"

export default async function PanelHome({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const user = await requireCustomer()
  const { welcome } = await searchParams
  const [{ stats, recent }, wallet, profile] = await Promise.all([
    getCustomerDashboard(user.id),
    getCustomerWallet(user.id),
    getCustomerProfile(user.id),
  ])
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : user.name
  const boxNumber = user.boxNumber ?? "—"

  return (
    <div>
      {welcome && (
        <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <PartyPopper className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-navy">¡Bienvenido a US1 Miami, {profile?.firstName ?? user.name}!</h2>
              <p className="text-sm text-muted-foreground">
                Tu casillero <span className="font-semibold text-primary">{boxNumber}</span> ya está activo. Usá tu
                nueva dirección de Miami para comprar en cualquier tienda.
              </p>
            </div>
          </div>
        </div>
      )}

      <PageHeader
        title={`Hola, ${profile?.firstName ?? user.name}`}
        description="Este es el resumen de tu cuenta y tus envíos."
      />

      <div className="mb-8">
        <AddressCard fullName={fullName} boxNumber={boxNumber} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Paquetes esperados" value={stats.expected} icon="Clock" />
        <StatCard label="Recibidos en Miami" value={stats.received} icon="PackageCheck" tone="primary" />
        <StatCard label="Disponibles" value={stats.available} icon="Package" tone="success" />
        <StatCard label="Pend. de consolidar" value={stats.pendingConsolidation} icon="Boxes" tone="warning" />
        <StatCard label="Consolidaciones" value={stats.consolidations} icon="Combine" />
        <StatCard label="Envíos en tránsito" value={stats.inTransit} icon="Plane" tone="primary" />
        <StatCard label="Paquetes en Argentina" value={stats.inArgentina} icon="MapPin" tone="success" />
        <StatCard label="Saldo de billetera" value={money(wallet?.availableBalance)} icon="Wallet" tone="primary" />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy">Paquetes recientes</h2>
          <Link href="/panel/paquetes" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            icon="PackageOpen"
            title="Todavía no tenés paquetes"
            description="Cuando compres online y uses tu dirección de Miami, tus paquetes aparecerán acá."
            action={
              <Link
                href="/panel/prealertar"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Prealertar un paquete
              </Link>
            }
          />
        ) : (
          <Card className="p-0">
            <div className="divide-y divide-border">
              {recent.map((p) => (
                <Link
                  key={p.id}
                  href={`/panel/paquetes/${p.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-navy">
                      {p.description || p.store || `Paquete #${p.id}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {p.store ? `${p.store} · ` : ""}
                      {p.trackingNumber ? `Tracking ${p.trackingNumber}` : p.wrNumber ? p.wrNumber : "Sin tracking"}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
