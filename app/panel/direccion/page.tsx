import * as Icons from "lucide-react"
import { requireCustomer } from "@/lib/session"
import { PageHeader, Card } from "@/components/portal/ui"
import { AddressCard } from "@/components/portal/address-card"

const TIPS = [
  "Usá siempre tu número de Box en la línea de dirección para que podamos identificar tu paquete.",
  "El nombre del destinatario debe coincidir con el titular de la cuenta.",
  "Cuando compres, prealertá el paquete para que lo vinculemos apenas llegue.",
  "El teléfono del depósito es solo para uso logístico del transportista.",
]

export default async function AddressPage() {
  const user = await requireCustomer()

  return (
    <div>
      <PageHeader
        title="Mi dirección en Miami"
        description="Esta es tu dirección personal para comprar en cualquier tienda de Estados Unidos y el mundo."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <AddressCard fullName={user.name} boxNumber={user.boxNumber ?? ""} />

        <Card>
          <h2 className="flex items-center gap-2 text-base font-semibold text-navy">
            <Icons.Lightbulb className="h-4 w-4 text-primary" />
            Cómo usar tu dirección
          </h2>
          <ul className="mt-4 space-y-3">
            {TIPS.map((t) => (
              <li key={t} className="flex gap-2.5 text-sm text-muted-foreground">
                <Icons.Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
