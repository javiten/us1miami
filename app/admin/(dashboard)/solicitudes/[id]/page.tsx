import Link from "next/link"
import { notFound } from "next/navigation"
import * as Icons from "lucide-react"
import { requirePermission } from "@/lib/session"
import { getConsolidationRequest } from "@/lib/queries/consolidation-requests"
import { PageHeader, Card } from "@/components/portal/ui"
import { RequestManager } from "@/components/admin/request-manager"
import { cwrStatusLabel } from "@/lib/constants"
import { money } from "@/lib/format"

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("consolidations.manage")
  const { id } = await params
  const reqId = Number(id)
  if (!Number.isFinite(reqId)) notFound()

  const req = await getConsolidationRequest(reqId)
  if (!req) notFound()

  const isOpen = req.status === "REQUESTED" || req.status === "UNDO_REQUESTED"

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/solicitudes"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-navy"
      >
        <Icons.ChevronLeft className="h-4 w-4" /> Volver a solicitudes
      </Link>

      <PageHeader
        title={`Solicitud #${req.id}`}
        description={`${req.customerName ?? "Cliente"}${req.boxNumber ? ` · ${req.boxNumber}` : ""} · Recibida el ${new Date(req.createdAt).toLocaleDateString("es-AR")}`}
      />

      <div className="mb-6 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="order-2 lg:order-1">
          {isOpen ? (
            <RequestManager id={req.id} status={req.status} members={req.packages} addable={req.addable} />
          ) : (
            <Card>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>
                  Esta solicitud ya fue procesada (estado actual: <strong className="text-navy">{cwrStatusLabel(req.status)}</strong>
                  {req.cwrNumber ? ` · ${req.cwrNumber}` : ""}).
                </span>
              </div>
            </Card>
          )}
        </div>

        <div className="order-1 space-y-4 lg:order-2">
          <Card>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-navy">Estado</span>
              <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                {cwrStatusLabel(req.status)}
              </span>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Paquetes</dt>
                <dd className="font-medium text-navy">{req.packages.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Valor declarado</dt>
                <dd className="font-medium text-navy">
                  {money(req.packages.reduce((s, p) => s + Number(p.declaredValue ?? 0), 0))}
                </dd>
              </div>
            </dl>
            {req.notes && (
              <div className="mt-4 rounded-xl bg-muted/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Instrucciones del cliente</p>
                <p className="mt-1 text-sm text-navy">{req.notes}</p>
              </div>
            )}
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contenido</p>
            <ul className="mt-3 space-y-2">
              {req.packages.map((p) => (
                <li key={p.id} className="text-sm">
                  <span className="block font-medium text-navy">{p.description || "Paquete sin descripción"}</span>
                  <span className="block text-xs text-muted-foreground">
                    {p.wrNumber || "Sin WR"} · {p.store || "Tienda no informada"} ·{" "}
                    {p.weightLb ? `${p.weightLb} lb` : "Peso pendiente"}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
