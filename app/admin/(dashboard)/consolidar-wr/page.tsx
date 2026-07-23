import { requirePermission } from "@/lib/session"
import { getAllCwrs } from "@/lib/queries/admin"
import { PageHeader, Card } from "@/components/portal/ui"
import { ConsolidateWrWorkflow } from "@/components/admin/consolidate-wr-workflow"
import { cwrStatusLabel } from "@/lib/constants"

export const metadata = { title: "Consolidar WR — Admin US1 Miami" }

export default async function ConsolidarWrPage() {
  await requirePermission("consolidations.manage")
  const cwrs = await getAllCwrs()

  return (
    <div>
      <PageHeader
        title="Consolidar WR"
        description="Escaneá los WR de un mismo cliente para agruparlos en un consolidado (CWR)."
      />

      <ConsolidateWrWorkflow />

      <Card className="mt-6">
        <h2 className="mb-4 text-base font-semibold text-navy">Consolidados recientes</h2>
        {cwrs.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Todavía no hay consolidados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">CWR</th>
                  <th className="pb-2 pr-4 font-medium">Cliente</th>
                  <th className="pb-2 pr-4 font-medium">Piezas</th>
                  <th className="pb-2 pr-4 font-medium">Peso</th>
                  <th className="pb-2 pr-4 font-medium">Estado</th>
                  <th className="pb-2 font-medium">Etiqueta</th>
                </tr>
              </thead>
              <tbody>
                {cwrs.map((c) => (
                  <tr key={c.cwr.id} className="border-b border-border/60">
                    <td className="py-2.5 pr-4 font-semibold text-foreground">{c.cwr.cwrNumber}</td>
                    <td className="py-2.5 pr-4 text-foreground">
                      {c.customerName} <span className="text-muted-foreground">· {c.boxNumber}</span>
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{c.cwr.pieces ?? c.cwr.packageIds.length}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{c.cwr.weightLb ? `${c.cwr.weightLb} lb` : "—"}</td>
                    <td className="py-2.5 pr-4">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                        {cwrStatusLabel(c.cwr.status)}
                      </span>
                    </td>
                    <td className="py-2.5">
                      {c.cwr.cwrNumber && (
                        <a
                          href={`/admin/cwr/${encodeURIComponent(c.cwr.cwrNumber)}/label`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Imprimir
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
