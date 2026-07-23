import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, Printer } from "lucide-react"
import { requirePermission } from "@/lib/session"
import { getPackageById } from "@/lib/queries/admin"
import { PageHeader, StatusBadge, StatusTimeline, Card } from "@/components/portal/ui"
import { money } from "@/lib/format"
import type { PackageStatus } from "@/lib/constants"

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value || "—"}</span>
    </div>
  )
}

export default async function AdminPackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("warehouse.records")
  const { id } = await params
  const row = await getPackageById(Number(id))
  if (!row) notFound()

  const { pkg } = row
  const customerName = row.firstName && row.lastName ? `${row.firstName} ${row.lastName}` : (row.customerName ?? "—")
  const dims =
    pkg.lengthIn && pkg.widthIn && pkg.heightIn ? `${pkg.lengthIn} × ${pkg.widthIn} × ${pkg.heightIn} in` : null
  const receivedAt = pkg.receivedAt ? new Date(pkg.receivedAt).toLocaleString("es-AR") : null

  return (
    <div>
      <Link
        href="/admin/paquetes"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a paquetes
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title={pkg.wrNumber ?? `Paquete #${pkg.id}`}
          description={`${customerName} · Casilla ${pkg.boxNumber ?? "—"}`}
        />
        {pkg.wrNumber && (
          <Link
            href={`/admin/wr/${encodeURIComponent(pkg.wrNumber)}/label`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            <Printer className="h-4 w-4" /> Imprimir etiqueta
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {pkg.photos && pkg.photos.length > 0 && (
            <Card>
              <h2 className="mb-3 text-sm font-semibold text-foreground">Fotos del paquete</h2>
              <div className="grid grid-cols-3 gap-3">
                {pkg.photos.map((src, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                    <Image
                      src={`/api/warehouse/file?pathname=${encodeURIComponent(src)}`}
                      alt={`Foto ${i + 1} del paquete`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Detalles del paquete</h2>
            <Row label="Cliente" value={customerName} />
            <Row label="Tienda / Remitente" value={pkg.store} />
            <Row label="Tracking" value={pkg.trackingNumber} />
            <Row label="Transportista" value={pkg.carrier} />
            <Row label="Contenido" value={pkg.description} />
            <Row label="Valor declarado" value={pkg.declaredValue ? money(pkg.declaredValue) : null} />
            <Row label="Peso" value={pkg.weightLb ? `${pkg.weightLb} lb` : null} />
            <Row label="Dimensiones" value={dims} />
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Recepción en depósito</h2>
            <Row label="Ubicación" value={pkg.warehouseLocation} />
            <Row label="Operador" value={pkg.receivedByName} />
            <Row label="Estación" value={pkg.workstation} />
            <Row label="Recibido" value={receivedAt} />
            <Row label="Notas internas" value={pkg.notes} />
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Documentos</h2>
            <Row label="WR (Warehouse Receipt)" value={pkg.wrNumber} />
            <Row label="CWR (Consolidación)" value={pkg.cwrNumber} />
            <Row label="AW (Guía aérea)" value={pkg.awNumber} />
            <Row label="MAWB (Guía madre)" value={pkg.mawbNumber} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Estado</h2>
            <div className="mb-4">
              <StatusBadge status={pkg.status} />
            </div>
            <StatusTimeline current={pkg.status as PackageStatus} />
          </Card>
        </div>
      </div>
    </div>
  )
}
