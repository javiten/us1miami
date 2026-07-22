import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Logo } from "@/components/logo"
import { LoginForm } from "@/components/login-form"
import { getSessionUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Iniciar sesión — US1 Miami",
  description: "Ingresá a tu panel de US1 Miami para ver tus paquetes, tu casillero y tu billetera.",
}

export default async function IngresarPage() {
  const user = await getSessionUser()
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/panel")

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center">
          <Logo />
        </Link>
        <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-[0_24px_60px_-30px_rgba(7,27,58,0.35)]">
          <h1 className="text-center text-2xl font-bold tracking-tight text-navy">Bienvenido de nuevo</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Ingresá para gestionar tus paquetes y envíos.
          </p>
          <div className="mt-6">
            <LoginForm redirectTo="/panel" />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tenés cuenta?{" "}
          <Link href="/registro" className="font-semibold text-primary hover:underline">
            Creá tu dirección gratis
          </Link>
        </p>
      </div>
    </main>
  )
}
