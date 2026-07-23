"use client"

import { useActionState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { createPrealert, type ActionState } from "@/app/actions/customer-actions"

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-navy shadow-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
const labelClass = "mb-1.5 block text-sm font-medium text-navy"

const CARRIERS = ["Amazon", "UPS", "FedEx", "USPS", "DHL", "Otro"]

export function PrealertForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createPrealert, {})

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="store">
            Tienda
          </label>
          <input id="store" name="store" required className={inputClass} placeholder="Amazon, eBay, Nike…" />
        </div>
        <div>
          <label className={labelClass} htmlFor="trackingNumber">
            Número de tracking
          </label>
          <input id="trackingNumber" name="trackingNumber" className={inputClass} placeholder="1Z999AA1..." />
        </div>
        <div>
          <label className={labelClass} htmlFor="carrier">
            Transportista
          </label>
          <select id="carrier" name="carrier" className={inputClass} defaultValue="">
            <option value="">Seleccionar</option>
            {CARRIERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="estimatedValue">
            Valor estimado (USD)
          </label>
          <input
            id="estimatedValue"
            name="estimatedValue"
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            placeholder="120.00"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="description">
            Descripción del contenido
          </label>
          <input
            id="description"
            name="description"
            className={inputClass}
            placeholder="Zapatillas, electrónica, ropa…"
          />
        </div>
      </div>

      {state.error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-10px_rgba(15,125,255,0.85)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Enviando…" : "Prealertar paquete"}
      </button>
    </form>
  )
}
