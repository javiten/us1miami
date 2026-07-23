import { redirect } from "next/navigation"
import * as Icons from "lucide-react"
import { getAdminSessionUser } from "@/lib/session"
import { AdminLoginForm } from "@/components/admin/admin-login-form"

export const metadata = { title: "Panel de administración — US1 Miami" }

export default async function AdminLoginPage() {
  const user = await getAdminSessionUser()
  if (user?.role === "ADMIN") redirect("/admin")

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Icons.ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-white">Panel interno US1 Miami</h1>
          <p className="mt-1 text-sm text-slate-400">Acceso exclusivo para el equipo autorizado.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
          <AdminLoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Este acceso queda registrado en la auditoría del sistema.
        </p>
      </div>
    </main>
  )
}
