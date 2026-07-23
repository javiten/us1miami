import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Check } from "lucide-react"
import { Logo } from "@/components/logo"
import { RegisterForm } from "@/components/register-form"
import { getCustomerSessionUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Crear mi dirección — US1 Miami",
  description: "Registrate y obtené tu dirección gratuita en Miami para comprar en cualquier tienda del mundo.",
}

const BENEFITS = [
  "Dirección propia en Miami en segundos",
  "Número de casillero US1 único y permanente",
  "Recepción, almacenamiento y consolidación gratis",
  "Envío aéreo a Argentina en ~7 días",
]

export default async function RegistroPage() {
  // Only an existing CUSTOMER session skips registration. An admin-only session
  // must still be able to reach the customer sign-up form.
  const user = await getCustomerSessionUser()
  if (user?.role === "CUSTOMER") redirect("/panel")

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_1.15fr] lg:py-16">
        {/* Left rail */}
        <aside className="lg:sticky lg:top-16 lg:h-fit">
          <Link href="/" className="inline-flex">
            <Logo />
          </Link>
          <h1 className="mt-8 text-balance text-3xl font-bold tracking-tight text-navy lg:text-4xl">
            Creá tu dirección en Miami y comprá en todo el mundo
          </h1>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Registrate gratis y en el momento te asignamos un casillero exclusivo. Comprá en Amazon, eBay y cualquier
            tienda de Estados Unidos, y nosotros lo enviamos a tu casa en Argentina.
          </p>
          <ul className="mt-8 space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm text-navy">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link href="/ingresar" className="font-semibold text-primary hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </aside>

        {/* Form */}
        <div>
          <RegisterForm />
        </div>
      </div>
    </main>
  )
}
