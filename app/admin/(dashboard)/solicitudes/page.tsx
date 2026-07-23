import Link from "next/link"
import { requirePermission } from "@/lib/session"
import { getConsolidationRequests } from "@/lib/queries/consolidation-requests"
import { PageHeader, Card, EmptyState } from "@/components/portal/ui"
import { cwrStatusLabel } from "@/lib/constants"

export const metadata = { title: "Solicitudes de consolidación — US1 Miami" }

function statusTone(status: string): string {
  if (status === "UNDO_REQUESTED") return "bg-orange-50 text-orange-600"
  return "bg-amber-50 text-amber-600"
}

export default async function AdminRequestsPage() {
  await requirePermission("consolidations.manage")
  const rows = await getConsolidationRequests()
  const undoCount = rows.filter((r) => r.status === "UNDO_REQUESTED").length

  return (
    <div>
      <PageHeader
        title="Solicitudes de consolidación"
        description="Pedidos enviados por los clientes. Aceptalos para pesarlos y facturarlos, editá los paquetes o resolvé las bajas."
      />

      {rows.length === 0 ? (
        <EmptyState
          icon="Inbox"
          title="No hay solicitudes pendientes"
          description="Cuando un cliente solicite una consolidación desde su panel, la vas a ver acá para aceptarla o editarla."
        />
      ) : (
        <Card className="p-0">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <span className="text-sm font-semibold text-navy">{rows.length} solicitud{rows.length === 1 ? "" : "es"} abierta{rows.length === 1 ? "" : "s"}</span>
            {undoCount > 0 && (
              <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                {undoCount} baja{undoCount === 1 ? "" : "s"} por revisar
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Solicitud</th>
                  <th className="px-5 py-3 font-medium">Cliente</th>
                  <th className="px-5 py-3 text-right font-medium">Paquetes</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium">Fecha</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                    <td className="px-5 py-3 font-semibold text-navy">Solicitud #{r.id}</td>
                    <td className="px-5 py-3">
                      <span className="text-navy">{r.customerName ?? "—"}</span>
                      {r.boxNumber && <span className="ml-1 text-xs text-muted-foreground">({r.boxNumber})</span>}
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{r.packageIds.length}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(r.status)}`}>
                        {cwrStatusLabel(r.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/solicitudes/${r.id}`} className="font-medium text-primary hover:underline">
                        Gestionar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
