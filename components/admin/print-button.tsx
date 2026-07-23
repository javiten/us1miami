"use client"

import { Printer } from "lucide-react"

export function PrintButton({ label = "Imprimir" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl bg-muted px-3.5 py-2 text-sm font-semibold text-navy transition-colors hover:bg-border print:hidden"
    >
      <Printer className="h-4 w-4" />
      {label}
    </button>
  )
}
