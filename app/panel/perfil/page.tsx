import { requireCustomer } from "@/lib/session"
import { getCustomerProfile } from "@/lib/queries/customer"
import { PageHeader, Card } from "@/components/portal/ui"
import { ProfileForm } from "@/components/portal/profile-form"

export default async function ProfilePage() {
  const user = await requireCustomer()
  const profile = await getCustomerProfile(user.id)

  return (
    <div>
      <PageHeader title="Mi perfil" description="Mantené tus datos de contacto y entrega en Argentina actualizados." />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-navy">Datos personales y de entrega</h2>
          <ProfileForm
            profile={{
              phone: user.phone,
              street: profile?.street ?? null,
              streetNumber: profile?.streetNumber ?? null,
              floor: profile?.floor ?? null,
              apartment: profile?.apartment ?? null,
              city: profile?.city ?? null,
              province: profile?.province ?? null,
              postalCode: profile?.postalCode ?? null,
              references: profile?.references ?? null,
            }}
          />
        </Card>

        <Card className="h-fit">
          <h2 className="mb-4 text-base font-semibold text-navy">Cuenta</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Nombre</dt>
              <dd className="font-medium text-navy">{user.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium text-navy">{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Número de Box</dt>
              <dd className="font-semibold text-primary">{user.boxNumber}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}
