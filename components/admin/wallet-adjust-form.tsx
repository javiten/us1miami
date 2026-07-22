"use client"

import { useActionState, useState } from "react"
import { adjustWallet, type AdminActionState } from "@/app/actions/admin-actions"

export function WalletAdjustForm({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState<AdminActionState, FormData>(adjustWallet, {})
  const [direction, setDirection] = useState<"credit" | "debit">("credit")

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="direction" value={direction} />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setDirection("credit")}
          className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
            direction === "credit"
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-border text-muted-foreground hover:border-emerald-300"
          }`}
        >
          Acreditar
        </button>
        <button
          type="button"
          onClick={() => setDirection("debit")}
          className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
            direction === "debit"
              ? "border-red-500 bg-red-50 text-red-700"
              : "border-border text-muted-foreground hover:border-red-300"
          }`}
        >
          Debitar
        </button>
      </div>

      <div>
        <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-navy">
          Monto (USD)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min={0.01}
          step="0.01"
          required
          className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label htmlFor="reason" className="mb-1.5 block text-sm font-medium text-navy">
          Motivo
        </label>
        <input
          id="reason"
          name="reason"
          required
          placeholder="Ej: reintegro por sobrepeso"
          className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700" role="status">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy/90 disabled:opacity-50"
      >
        {pending ? "Aplicando…" : "Aplicar ajuste"}
      </button>
    </form>
  )
}
