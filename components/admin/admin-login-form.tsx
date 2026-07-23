"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import * as Icons from "lucide-react"
import { authClient } from "@/lib/auth-client"

export function AdminLoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)
    const form = new FormData(e.currentTarget)
    const usernameRaw = String(form.get("username") ?? "").trim().toLowerCase()
    const password = String(form.get("password") ?? "")
    // Admins sign in with a username that maps to an internal email.
    const email = usernameRaw.includes("@") ? usernameRaw : `${usernameRaw}@us1miami.internal`

    const { error } = await authClient.signIn.email({ email, password })
    if (error) {
      setError("Credenciales inválidas. Verificá tu email y contraseña.")
      setPending(false)
      return
    }
    router.push("/admin")
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-200">
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoCapitalize="none"
          autoComplete="username"
          required
          placeholder="User ID"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-200">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Contraseña"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? "Ingresando…" : "Ingresar al panel"}
        <Icons.ShieldCheck className="h-4 w-4" />
      </button>
    </form>
  )
}
