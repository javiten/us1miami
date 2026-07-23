"use client"

import { useActionState } from "react"
import * as Icons from "lucide-react"
import { requestUndoConsolidation, type ActionState } from "@/app/actions/customer-actions"

export function UndoRequestButton({ consolidationId }: { consolidationId: number }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(requestUndoConsolidation, {})

  if (state.ok) {
    return (
      <p className="mt-2.5 text-xs font-medium text-emerald-700" role="status">
        {state.message}
      </p>
    )
  }

  return (
    <form action={action} className="mt-2.5">
      <input type="hidden" name="consolidationId" value={consolidationId} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-red-200 hover:text-red-600 disabled:opacity-50"
      >
        <Icons.Undo2 className="h-3.5 w-3.5" />
        {pending ? "Enviando…" : "Deshacer solicitud de consolidación"}
      </button>
      {state.error && (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {state.error}
        </p>
      )}
    </form>
  )
}
