import { requirePermission } from "@/lib/session"
import { PageHeader } from "@/components/portal/ui"
import { ReceptionWizard } from "@/components/admin/reception-wizard"

export const metadata = { title: "Recepción de paquetes — US1 Miami" }

export default async function ReceptionPage() {
  const admin = await requirePermission("warehouse.receive")
  const workstation = `WS-${admin.name.split(" ")[0] ?? "01"}`

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Recepción de paquetes"
        description="Escaneá, pesá, fotografiá y generá el Warehouse Receipt en 4 pasos."
      />
      <ReceptionWizard workstation={workstation} />
    </div>
  )
}
