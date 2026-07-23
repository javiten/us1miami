"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import * as Icons from "lucide-react"
import { StatusBadge } from "@/components/portal/ui"
import { WrDrawer } from "@/components/admin/wr-drawer"
import { PACKAGE_STATUS, PACKAGE_INCIDENTS } from "@/lib/constants"
import { cn } from "@/lib/utils"

type Row = {
  id: number
  status: string
  wrNumber: string | null
  trackingNumber: string | null
  boxNumber: string | null
  description: string | null
  store: string | null
  weightLb: string | null
  receivedAt: Date | string | null
  customerName: string | null
  userId: string | null
}

type Customer = { id: string; name: string | null; boxNumber: string | null }

type Perms = {
  edit: boolean
  transition: boolean
  notes: boolean
  reassign: boolean
  labels: boolean
}

export function PackagesTable({
  rows,
  counts,
  status,
  search,
  perms,
  customers,
}: {
  rows: Row[]
  counts: Record<string, number>
  status: string
  search: string
  perms: Perms
  customers: Customer[]
}) {
  const router = useRouter()
  const [openId, setOpenId] = useState<number | null>(null)
  const [term, setTerm] = useState(search)

  const applySearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams()
      if (status) params.set("status", status)
      if (value.trim()) params.set("q", value.trim())
      const qs = params.toString()
      router.push(qs ? `/admin/paquetes?${qs}` : "/admin/paquetes")
    },
    [router, status],
  )

  const filters = [
    { label: "Todos", value: "" },
    ...Object.entries(PACKAGE_STATUS).map(([value, label]) => ({ label, value })),
    ...Object.entries(PACKAGE_INCIDENTS).map(([value, label]) => ({ label, value })),
  ]

  function tabHref(value: string) {
    const params = new URLSearchParams()
    if (value) params.set("status", value)
    if (search) params.set("q", search)
    const qs = params.toString()
    return qs ? `/admin/paquetes?${qs}` : "/admin/paquetes"
  }

  return (
    <>
      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          applySearch(term)
        }}
        className="mb-4 flex gap-2"
      >
        <div className="relative flex-1">
          <Icons.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar por WR, tracking, casilla, cliente, contenido…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
        >
          Buscar
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setTerm("")
              applySearch("")
            }}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Limpiar
          </button>
        )}
      </form>

      {/* Filter tabs with counters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = status === f.value
          const n = counts[f.value] ?? 0
          return (
            <Link
              key={f.value || "all"}
              href={tabHref(f.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs font-semibold",
                  active ? "bg-primary-foreground/20" : "bg-muted",
                )}
              >
                {n}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">WR</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Casilla</th>
              <th className="px-4 py-3 font-medium">Descripción</th>
              <th className="px-4 py-3 font-medium">Peso</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Recibido</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No hay paquetes para este filtro.
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setOpenId(p.id)}
                  className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">{p.wrNumber ?? `#${p.id}`}</td>
                  <td className="px-4 py-3">
                    {p.customerName ?? <span className="text-muted-foreground">Sin asignar</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.boxNumber ?? "—"}</td>
                  <td className="px-4 py-3 text-foreground">{p.description ?? p.store ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.weightLb ? `${p.weightLb} lb` : "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.receivedAt ? new Date(p.receivedAt).toLocaleDateString("es-AR") : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <WrDrawer
        packageId={openId}
        onClose={() => setOpenId(null)}
        onChanged={() => router.refresh()}
        perms={perms}
        customers={customers}
      />
    </>
  )
}
