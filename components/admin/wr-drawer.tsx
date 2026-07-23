"use client"

import { useEffect, useState, useTransition, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import * as Icons from "lucide-react"
import {
  loadPackageDetail,
  transitionPackageStatus,
  editPackage,
  updatePackageNotes,
  reassignPackageBox,
} from "@/app/actions/package-actions"
import { StatusBadge } from "@/components/portal/ui"
import { statusLabel, allowedTransitions, isIncident } from "@/lib/constants"
import { cn } from "@/lib/utils"

type Detail = Awaited<ReturnType<typeof loadPackageDetail>>
type Customer = { id: string; name: string | null; boxNumber: string | null }

type Perms = {
  edit: boolean
  transition: boolean
  notes: boolean
  reassign: boolean
  labels: boolean
}

type Tab = "details" | "status" | "notes" | "history"

const TABS: { id: Tab; label: string; icon: keyof typeof Icons }[] = [
  { id: "details", label: "Detalles", icon: "Package" },
  { id: "status", label: "Estado", icon: "GitBranch" },
  { id: "notes", label: "Notas", icon: "StickyNote" },
  { id: "history", label: "Historial", icon: "History" },
]

function fmtDate(d: Date | string | null | undefined) {
  if (!d) return "—"
  return new Date(d).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })
}

export function WrDrawer({
  packageId,
  onClose,
  onChanged,
  perms,
  customers,
}: {
  packageId: number | null
  onClose: () => void
  onChanged: () => void
  perms: Perms
  customers: Customer[]
}) {
  const [detail, setDetail] = useState<Detail>(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<Tab>("details")
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const open = packageId !== null

  const refresh = useCallback(async () => {
    if (packageId === null) return
    setLoading(true)
    const d = await loadPackageDetail(packageId)
    setDetail(d)
    setLoading(false)
  }, [packageId])

  useEffect(() => {
    if (packageId === null) {
      setDetail(null)
      return
    }
    setTab("details")
    setError(null)
    void refresh()
  }, [packageId, refresh])

  // Close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") (lightbox ? setLightbox(null) : onClose())
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose, lightbox])

  if (!open) return null

  const pkg = detail?.row.pkg
  const customerName =
    detail?.row.firstName && detail?.row.lastName
      ? `${detail.row.firstName} ${detail.row.lastName}`
      : (detail?.row.customerName ?? "—")

  function run(fn: () => Promise<{ ok?: boolean; error?: string }>) {
    setError(null)
    startTransition(async () => {
      const res = await fn()
      if (res.error) {
        setError(res.error)
        return
      }
      await refresh()
      onChanged()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Detalle del paquete">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative flex h-full w-full max-w-xl flex-col bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-foreground">
                {pkg?.wrNumber ?? (loading ? "Cargando…" : `#${packageId}`)}
              </span>
              {pkg && <StatusBadge status={pkg.status} />}
            </div>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {customerName} · Casilla {pkg?.boxNumber ?? "—"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {perms.labels && pkg?.wrNumber && (
              <Link
                href={`/admin/wr/${encodeURIComponent(pkg.wrNumber)}/label`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:opacity-90"
              >
                <Icons.Printer className="h-3.5 w-3.5" /> Etiqueta
              </Link>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Cerrar"
            >
              <Icons.X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border px-3">
          {TABS.filter((t) => (t.id === "notes" ? perms.notes || perms.edit : true)).map((t) => {
            const Icon = Icons[t.icon] as React.ComponentType<{ className?: string }>
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                  tab === t.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            )
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <Icons.AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}
          {loading || !pkg ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Cargando detalle…</div>
          ) : (
            <>
              {tab === "details" && (
                <DetailsTab
                  pkg={pkg}
                  customerName={customerName}
                  perms={perms}
                  pending={pending}
                  onSave={(patch) => run(() => editPackage({ packageId: pkg.id, ...patch }))}
                  onOpenPhoto={setLightbox}
                />
              )}
              {tab === "status" && (
                <StatusTab
                  status={pkg.status}
                  perms={perms}
                  customers={customers}
                  currentUserId={pkg.userId}
                  pending={pending}
                  onTransition={(toStatus, note) =>
                    run(() => transitionPackageStatus({ packageId: pkg.id, toStatus, note }))
                  }
                  onReassign={(toUserId, reason) =>
                    run(() => reassignPackageBox({ packageId: pkg.id, toUserId, reason }))
                  }
                />
              )}
              {tab === "notes" && (
                <NotesTab
                  notes={pkg.notes}
                  pending={pending}
                  onSave={(notes) => run(() => updatePackageNotes({ packageId: pkg.id, notes }))}
                />
              )}
              {tab === "history" && <HistoryTab history={detail?.history ?? []} />}
            </>
          )}
        </div>
      </div>

      {lightbox && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 p-8"
          onClick={() => setLightbox(null)}
        >
          <div className="relative h-full w-full">
            <Image
              src={`/api/warehouse/file?pathname=${encodeURIComponent(lightbox)}`}
              alt="Foto del paquete"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value || "—"}</span>
    </div>
  )
}

type Pkg = NonNullable<Detail>["row"]["pkg"]

function DetailsTab({
  pkg,
  customerName,
  perms,
  pending,
  onSave,
  onOpenPhoto,
}: {
  pkg: Pkg
  customerName: string
  perms: Perms
  pending: boolean
  onSave: (patch: Record<string, string>) => void
  onOpenPhoto: (src: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})

  function startEdit() {
    setForm({
      trackingNumber: pkg.trackingNumber ?? "",
      carrier: pkg.carrier ?? "",
      description: pkg.description ?? "",
      quantity: pkg.quantity != null ? String(pkg.quantity) : "",
      weightLb: pkg.weightLb ?? "",
      lengthIn: pkg.lengthIn ?? "",
      widthIn: pkg.widthIn ?? "",
      heightIn: pkg.heightIn ?? "",
      warehouseLocation: pkg.warehouseLocation ?? "",
    })
    setEditing(true)
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const dims =
    pkg.lengthIn && pkg.widthIn && pkg.heightIn ? `${pkg.lengthIn} × ${pkg.widthIn} × ${pkg.heightIn} in` : null

  if (editing) {
    return (
      <div className="space-y-3">
        {(
          [
            ["trackingNumber", "Tracking"],
            ["carrier", "Transportista"],
            ["description", "Contenido"],
            ["quantity", "Piezas"],
            ["weightLb", "Peso (lb)"],
            ["lengthIn", "Largo (in)"],
            ["widthIn", "Ancho (in)"],
            ["heightIn", "Alto (in)"],
            ["warehouseLocation", "Ubicación"],
          ] as const
        ).map(([k, label]) => (
          <label key={k} className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
            <input
              value={form[k] ?? ""}
              onChange={set(k)}
              inputMode={["quantity", "weightLb", "lengthIn", "widthIn", "heightIn"].includes(k) ? "decimal" : "text"}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </label>
        ))}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => onSave(form)}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {pkg.photos && pkg.photos.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Fotos</h3>
          <div className="grid grid-cols-3 gap-2">
            {pkg.photos.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onOpenPhoto(src)}
                className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                <Image
                  src={`/api/warehouse/file?pathname=${encodeURIComponent(src)}`}
                  alt={`Foto ${i + 1}`}
                  fill
                  unoptimized
                  className="object-cover transition-transform hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Detalles</h3>
          {perms.edit && (
            <button
              type="button"
              onClick={startEdit}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Icons.Pencil className="h-3.5 w-3.5" /> Editar
            </button>
          )}
        </div>
        <Field label="Cliente" value={customerName} />
        <Field label="Tienda / Remitente" value={pkg.store} />
        <Field label="Tracking" value={pkg.trackingNumber} />
        <Field label="Transportista" value={pkg.carrier} />
        <Field label="Contenido" value={pkg.description} />
        <Field label="Piezas" value={pkg.quantity != null ? String(pkg.quantity) : null} />
        <Field label="Peso" value={pkg.weightLb ? `${pkg.weightLb} lb` : null} />
        <Field label="Dimensiones" value={dims} />
        <Field label="Ubicación" value={pkg.warehouseLocation} />
        <Field label="Operador" value={pkg.receivedByName} />
        <Field label="Recibido" value={fmtDate(pkg.receivedAt)} />
      </div>
    </div>
  )
}

function StatusTab({
  status,
  perms,
  customers,
  currentUserId,
  pending,
  onTransition,
  onReassign,
}: {
  status: string
  perms: Perms
  customers: Customer[]
  currentUserId: string
  pending: boolean
  onTransition: (toStatus: string, note?: string) => void
  onReassign: (toUserId: string, reason?: string) => void
}) {
  const [target, setTarget] = useState("")
  const [note, setNote] = useState("")
  const [reassignTo, setReassignTo] = useState("")
  const [reason, setReason] = useState("")
  const options = allowedTransitions(status)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 text-sm font-semibold text-foreground">Estado actual</h3>
        <div className="mb-3">
          <StatusBadge status={status} />
          {isIncident(status) && (
            <span className="ml-2 text-xs text-rose-600">Incidencia — fuera del flujo normal</span>
          )}
        </div>

        {perms.transition ? (
          options.length === 0 ? (
            <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
              No hay transiciones disponibles desde este estado.
            </p>
          ) : (
            <div className="space-y-2">
              <span className="block text-xs font-medium text-muted-foreground">Cambiar a</span>
              <div className="flex flex-wrap gap-2">
                {options.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setTarget(o)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                      target === o
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {statusLabel(o)}
                  </button>
                ))}
              </div>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nota (opcional)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              <button
                type="button"
                disabled={!target || pending}
                onClick={() => onTransition(target, note)}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {pending ? "Aplicando…" : "Aplicar cambio de estado"}
              </button>
            </div>
          )
        ) : (
          <p className="text-sm text-muted-foreground">No tenés permiso para cambiar el estado.</p>
        )}
      </div>

      {perms.reassign && (
        <div className="border-t border-border pt-5">
          <h3 className="mb-2 text-sm font-semibold text-foreground">Reasignar casilla (Super-Admin)</h3>
          <select
            value={reassignTo}
            onChange={(e) => setReassignTo(e.target.value)}
            className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="">Seleccionar cliente destino…</option>
            {customers
              .filter((c) => c.id !== currentUserId)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name ?? c.id} {c.boxNumber ? `· ${c.boxNumber}` : ""}
                </option>
              ))}
          </select>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Motivo (opcional)"
            className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          <button
            type="button"
            disabled={!reassignTo || pending}
            onClick={() => onReassign(reassignTo, reason)}
            className="w-full rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive disabled:opacity-60"
          >
            {pending ? "Reasignando…" : "Reasignar paquete"}
          </button>
        </div>
      )}
    </div>
  )
}

function NotesTab({
  notes,
  pending,
  onSave,
}: {
  notes: string | null
  pending: boolean
  onSave: (notes: string) => void
}) {
  const [value, setValue] = useState(notes ?? "")
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Notas internas</h3>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={8}
        placeholder="Notas visibles solo para el equipo…"
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
      />
      <button
        type="button"
        disabled={pending}
        onClick={() => onSave(value)}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar notas"}
      </button>
    </div>
  )
}

type AuditEntry = NonNullable<Detail>["history"][number]

function HistoryTab({ history }: { history: AuditEntry[] }) {
  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin historial registrado para este paquete.</p>
  }
  return (
    <ol className="space-y-3">
      {history.map((h) => {
        const meta = (h.metadata ?? {}) as Record<string, unknown>
        return (
          <li key={h.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-foreground">{describeAction(h.action, meta)}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{fmtDate(h.createdAt)}</span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{h.actorName ?? "Sistema"}</p>
            {typeof meta.note === "string" && meta.note && (
              <p className="mt-1 text-xs italic text-muted-foreground">“{meta.note}”</p>
            )}
          </li>
        )
      })}
    </ol>
  )
}

function describeAction(action: string, meta: Record<string, unknown>): string {
  switch (action) {
    case "PACKAGE_STATUS_CHANGED":
      return `Estado: ${meta.fromLabel ?? meta.from} → ${meta.toLabel ?? meta.to}`
    case "PACKAGE_EDITED":
      return "Datos editados"
    case "PACKAGE_NOTE_UPDATED":
      return "Nota actualizada"
    case "PACKAGE_REASSIGNED":
      return `Reasignado: ${meta.fromCustomer ?? "—"} → ${meta.toCustomer ?? "—"}`
    case "PACKAGE_RECEIVED":
      return "Paquete recibido"
    case "LABEL_PRINTED":
      return "Etiqueta impresa"
    case "LABEL_REPRINTED":
      return "Etiqueta reimpresa"
    default:
      return action
  }
}
