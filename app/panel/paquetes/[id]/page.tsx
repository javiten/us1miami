import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { requireCustomer } from "@/lib/session"
import { getCustomerPackage, money } from "@/lib/queries/customer"
import { PageHeader, Card, StatusTimeline } from "@/components/portal/ui"
import type { PackageStatus } from "@/lib/constants"

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-navy">{value}</span>
    </div>
  )
}

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireCustomer()
  const { id } = await params
  const pkg = await getCustomerPackage(user.id, Number(id))
  if (!pkg) notFound()

  const dims =
    pkg.lengthIn && pkg.widthIn && pkg.heightIn ? `${pkg.lengthIn} × ${pkg.widthIn} × ${pkg.heightIn} in` : null

  return (
    <div>
      <Link
        href="/panel/paquetes"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a mis paquetes
      </Link>
      <PageHeader title={pkg.description || pkg.store || `Paquete #${pkg.id}`} description={pkg.store ?? undefined} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {pkg.photos && pkg.photos.length > 0 && (
            <Card>
              <h2 className="mb-3 text-sm font-semibold text-navy">Fotos del paquete</h2>
              <div className="grid grid-cols-3 gap-3">
                {pkg.photos.map((src, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                    <Image src={src || "/placeholder.svg"} alt={`Foto ${i + 1} del paquete`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </Card>
          )}
          <Card>
            <h2 className="mb-3 text-sm font-semibold text-navy">Detalles</h2>
            <DetailRow label="Tienda" value={pkg.store} />
            <DetailRow label="Tracking" value={pkg.trackingNumber} />
            <DetailRow label="Transportista" value={pkg.carrier} />
            <DetailRow label="Valor declarado" value={pkg.declaredValue ? money(pkg.declaredValue) : null} />
            <DetailRow label="Peso" value={pkg.weightLb ? `${pkg.weightLb} lb` : null} />
            <DetailRow label="Dimensiones" value={dims} />
            <DetailRow label="Ubicación en depósito" value={pkg.warehouseLocation} />
          </Card>
          <Card>
            <h2 className="mb-3 text-sm font-semibold text-navy">Documentos</h2>
            <DetailRow label="WR (Warehouse Receipt)" value={pkg.wrNumber} />
            <DetailRow label="CWR (Consolidación)" value={pkg.cwrNumber} />
            <DetailRow label="AW (Guía aérea)" value={pkg.awNumber} />
            <DetailRow label="MAWB (Guía madre)" value={pkg.mawbNumber} />
            {!pkg.wrNumber && !pkg.cwrNumber && !pkg.awNumber && (
              <p className="py-2 text-sm text-muted-foreground">
                Los documentos se generarán cuando tu paquete sea procesado en Miami.
              </p>
            )}
          </Card>
        </div>

        <Card>
          <h2 className="mb-5 text-sm font-semibold text-navy">Estado del envío</h2>
          <StatusTimeline current={pkg.status as PackageStatus} />
        </Card>
      </div>
    </div>
  )
}
