import { requirePermission } from "@/lib/session"
import { PageHeader } from "@/components/portal/ui"
import { DeconsolidateCwrWorkflow } from "@/components/admin/deconsolidate-cwr-workflow"

export const metadata = { title: "Desconsolidar CWR — Admin US1 Miami" }

export default async function DesconsolidarCwrPage({
  searchParams,
}: {
  searchParams: Promise<{ cwr?: string }>
}) {
  await requirePermission("deconsolidation.manage")
  const { cwr } = await searchParams

  return (
    <div>
      <PageHeader
        title="Desconsolidar CWR"
        description="Desarmá un consolidado de cliente: verificá los WR y dejalos listos para entrega en Argentina."
      />
      <DeconsolidateCwrWorkflow initialCwr={cwr} />
    </div>
  )
}
