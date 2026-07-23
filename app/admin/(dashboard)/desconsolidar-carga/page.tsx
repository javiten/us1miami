import { requirePermission } from "@/lib/session"
import { PageHeader } from "@/components/portal/ui"
import { DeconsolidateMcWorkflow } from "@/components/admin/deconsolidate-mc-workflow"

export const metadata = { title: "Desconsolidar carga — Admin US1 Miami" }

export default async function DesconsolidarCargaPage() {
  await requirePermission("deconsolidation.manage")

  return (
    <div>
      <PageHeader
        title="Desconsolidar carga maestra"
        description="Recepción en Argentina: escaneá la MC y verificá cada CWR y WR contra el manifiesto."
      />
      <DeconsolidateMcWorkflow />
    </div>
  )
}
