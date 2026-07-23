import { requirePermission } from "@/lib/session"
import { getAllMcs } from "@/lib/queries/admin"
import { PageHeader, Card } from "@/components/portal/ui"
import { MasterCargoWorkflow } from "@/components/admin/master-cargo-workflow"
import { mcStatusLabel } from "@/lib/constants"

export const metadata = { title: "Carga maestra — Admin US1 Miami" }

export default async function CargaMaestraPage() {
  await requirePermission("master.manage")
  const mcs = await getAllMcs()

  return (
    <div>
      <PageHeader
        title="Carga maestra"
        description="Agrupá CWR de varios clientes y WR sueltos en una carga maestra (MC) para el despacho."
      />

      <MasterCargoWorkflow />

      <Card className="mt-6">
        <h2 className="mb-4 text-base font-semibold text-navy">Cargas maestras recientes</h2>
        {mcs.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Todavía no hay cargas maestras.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">MC</th>
                  <th className="pb-2 pr-4 font-medium">MAWB</th>
                  <th className="pb-2 pr-4 font-medium">Clientes</th>
                  <th className="pb-2 pr-4 font-medium">Piezas</th>
                  <th className="pb-2 pr-4 font-medium">Estado</th>
                  <th className="pb-2 font-medium">Manifiesto</th>
                </tr>
              </thead>
              <tbody>
                {mcs.map((m) => (
                  <tr key={m.id} className="border-b border-border/60">
                    <td className="py-2.5 pr-4 font-semibold text-foreground">{m.mcNumber}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{m.mawbNumber ?? "—"}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{m.customerCount ?? "—"}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{m.pieces ?? "—"}</td>
                    <td className="py-2.5 pr-4">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                        {mcStatusLabel(m.status)}
                      </span>
                    </td>
                    <td className="py-2.5">
                      {m.mcNumber && (
                        <a
                          href={`/admin/mc/${encodeURIComponent(m.mcNumber)}/manifiesto`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Ver
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
