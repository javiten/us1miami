import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { requireCustomer } from "@/lib/session"
import { getCustomerPackages, money } from "@/lib/queries/customer"
import { PageHeader, StatusBadge, EmptyState, Card } from "@/components/portal/ui"

export default async function PaquetesPage() {
  const user = await requireCustomer()
  const pkgs = await getCustomerPackages(user.id)

  return (
    <div>
      <PageHeader
        title="Mis paquetes"
        description="Seguí el estado de cada uno de tus paquetes, desde la compra hasta la entrega."
        action={
          <Link
            href="/panel/prealertar"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-12px_rgba(15,125,255,0.8)] transition-transform hover:-translate-y-0.5"
          >
            Prealertar paquete
          </Link>
        }
      />

      {pkgs.length === 0 ? (
        <EmptyState
          icon="PackageOpen"
          title="Todavía no tenés paquetes"
          description="Prealertá tu primera compra para empezar a seguir tus envíos."
        />
      ) : (
        <Card className="p-0">
          <div className="divide-y divide-border">
            {pkgs.map((p) => (
              <Link
                key={p.id}
                href={`/panel/paquetes/${p.id}`}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <span className="text-xs font-semibold">#{p.id}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-navy">{p.description || p.store || `Paquete #${p.id}`}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {p.store ? `${p.store} · ` : ""}
                    {p.wrNumber ? p.wrNumber : p.trackingNumber ? `Tracking ${p.trackingNumber}` : "Sin tracking"}
                    {p.weightLb ? ` · ${p.weightLb} lb` : ""}
                  </p>
                </div>
                <div className="hidden text-right sm:block">
                  {p.declaredValue && <p className="text-sm font-medium text-navy">{money(p.declaredValue)}</p>}
                </div>
                <StatusBadge status={p.status} />
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
