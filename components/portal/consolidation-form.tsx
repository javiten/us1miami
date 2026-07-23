"use client"

import { useActionState, useState } from "react"
import * as Icons from "lucide-react"
import { requestConsolidation, type ActionState } from "@/app/actions/customer-actions"
import { money } from "@/lib/format"

type Pkg = {
  id: number
  description: string | null
  store: string | null
  wrNumber: string | null
  weightLb: string | null
  declaredValue: string | null
}

export function ConsolidationForm({ available }: { available: Pkg[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(requestConsolidation, {})
  const [selected, setSelected] = useState<number[]>([])

  function toggle(id: number) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  if (available.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Icons.Boxes className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-base font-semibold text-navy">No hay paquetes disponibles para consolidar</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Cuando tengas uno o más paquetes en depósito, vas a poder prepararlos para el envío a Argentina.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-3">
        {available.map((p) => {
          const checked = selected.includes(p.id)
          return (
            <label
              key={p.id}
              className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors ${
                checked ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <input
                type="checkbox"
                name="packageIds"
                value={p.id}
                checked={checked}
                onChange={() => toggle(p.id)}
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy">
                  {p.description || "Paquete sin descripción"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {p.store || "Tienda no informada"} · {p.wrNumber || "Sin WR"} ·{" "}
                  {p.weightLb ? `${p.weightLb} lb` : "Peso pendiente"}
                </p>
              </div>
              <span className="text-sm font-medium text-navy">{money(p.declaredValue)}</span>
            </label>
          )
        })}
      </div>

      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-navy">
          Instrucciones (opcional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Ej: quitar cajas originales, agrupar por fragilidad…"
          className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
          {state.message}
        </p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selected.length} paquete{selected.length === 1 ? "" : "s"} seleccionado
          {selected.length === 1 ? "" : "s"}
        </p>
        <button
          type="submit"
          disabled={pending || selected.length < 1}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {pending ? "Enviando…" : "Solicitar consolidación"}
          <Icons.Combine className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}
