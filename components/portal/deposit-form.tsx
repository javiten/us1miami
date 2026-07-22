"use client"

import { useActionState } from "react"
import * as Icons from "lucide-react"
import { simulateDeposit, type ActionState } from "@/app/actions/customer-actions"

const PRESETS = [50, 100, 200, 500]

export function DepositForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(simulateDeposit, {})

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-navy">
          Monto a cargar (USD)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min={1}
          step="0.01"
          required
          placeholder="100.00"
          className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="submit"
            name="amount"
            value={p}
            disabled={pending}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-navy transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
          >
            +${p}
          </button>
        ))}
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

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? "Procesando…" : "Cargar saldo"}
        <Icons.CreditCard className="h-4 w-4" />
      </button>
      <p className="text-center text-xs text-muted-foreground">
        Pago simulado para demostración. La integración con Stripe se activa con las credenciales de producción.
      </p>
    </form>
  )
}
