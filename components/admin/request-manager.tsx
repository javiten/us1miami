"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import * as Icons from "lucide-react"
import {
  acceptConsolidationRequest,
  editConsolidationRequest,
  cancelConsolidationRequest,
  approveUndoConsolidation,
  rejectUndoConsolidation,
} from "@/app/actions/consolidation-actions"

type Pkg = {
  id: number
  wrNumber: string | null
  description: string | null
  store: string | null
  weightLb: string | null
  declaredValue: string | null
}

type Props = {
  id: number
  status: string
  members: Pkg[]
  addable: Pkg[]
}

function num(v: string): number | undefined {
  const n = Number.parseFloat(v)
  return Number.isFinite(n) && n > 0 ? n : undefined
}

export function RequestManager({ id, status, members, addable }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Edit state.
  const [removeIds, setRemoveIds] = useState<number[]>([])
  const [addIds, setAddIds] = useState<number[]>([])

  // Accept form state.
  const [weightLb, setWeightLb] = useState("")
  const [pieces, setPieces] = useState("")
  const [lengthIn, setLengthIn] = useState("")
  const [widthIn, setWidthIn] = useState("")
  const [heightIn, setHeightIn] = useState("")
  const [warehouseLocation, setWarehouseLocation] = useState("")
  const [notes, setNotes] = useState("")

  const isUndo = status === "UNDO_REQUESTED"
  const remaining = members.length - removeIds.length + addIds.length

  function toggle(list: number[], setList: (v: number[]) => void, value: number) {
    setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value])
  }

  function run(fn: () => Promise<{ ok?: boolean; error?: string }>, redirect = false) {
    setError(null)
    startTransition(async () => {
      const res = await fn()
      if (res.error) {
        setError(res.error)
        return
      }
      if (redirect) router.push("/admin/solicitudes")
      else router.refresh()
    })
  }

  function applyEdits() {
    if (!addIds.length && !removeIds.length) return
    run(() => editConsolidationRequest({ id, addIds, removeIds }))
    setAddIds([])
    setRemoveIds([])
  }

  function accept() {
    const w = num(weightLb)
    if (!w) {
      setError("Ingresá el peso final del envío consolidado.")
      return
    }
    run(
      () =>
        acceptConsolidationRequest({
          id,
          weightLb: w,
          pieces: num(pieces),
          lengthIn: num(lengthIn),
          widthIn: num(widthIn),
          heightIn: num(heightIn),
          warehouseLocation: warehouseLocation.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      true,
    )
  }

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {isUndo && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <div className="flex items-start gap-3">
            <Icons.Undo2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
            <div>
              <h3 className="text-sm font-semibold text-orange-800">El cliente pidió deshacer esta consolidación</h3>
              <p className="mt-1 text-sm text-orange-700">
                Al aprobar la baja, los paquetes vuelven a estar disponibles en el depósito. Si rechazás, la solicitud
                queda nuevamente activa.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => run(() => approveUndoConsolidation(id), true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
                >
                  <Icons.Check className="h-4 w-4" /> Aprobar baja
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => run(() => rejectUndoConsolidation(id))}
                  className="inline-flex items-center gap-2 rounded-xl border border-orange-300 bg-card px-4 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-100 disabled:opacity-50"
                >
                  <Icons.X className="h-4 w-4" /> Rechazar baja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit packages — only while the request is still pending. */}
      {!isUndo && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold text-navy">Editar paquetes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Quitá paquetes o sumá otros del mismo cliente antes de facturar.
          </p>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">En la solicitud</p>
            {members.map((p) => {
              const checked = removeIds.includes(p.id)
              return (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                    checked ? "border-red-300 bg-red-50" : "border-border bg-background"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(removeIds, setRemoveIds, p.id)}
                    className="h-4 w-4 rounded border-border text-red-600 focus:ring-red-500"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-navy">
                      {p.description || "Paquete sin descripción"}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {p.wrNumber || "Sin WR"} · {p.weightLb ? `${p.weightLb} lb` : "Peso pendiente"}
                    </span>
                  </span>
                  {checked && <span className="text-xs font-semibold text-red-600">Quitar</span>}
                </label>
              )
            })}
          </div>

          {addable.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Disponibles para sumar</p>
              {addable.map((p) => {
                const checked = addIds.includes(p.id)
                return (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                      checked ? "border-primary bg-primary/5" : "border-border bg-background"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(addIds, setAddIds, p.id)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-navy">
                        {p.description || "Paquete sin descripción"}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {p.wrNumber || "Sin WR"} · {p.weightLb ? `${p.weightLb} lb` : "Peso pendiente"}
                      </span>
                    </span>
                    {checked && <span className="text-xs font-semibold text-primary">Sumar</span>}
                  </label>
                )
              })}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">Quedarán {remaining} paquete{remaining === 1 ? "" : "s"}.</p>
            <button
              type="button"
              disabled={pending || (!addIds.length && !removeIds.length)}
              onClick={applyEdits}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-muted disabled:opacity-50"
            >
              <Icons.Save className="h-4 w-4" /> Aplicar cambios
            </button>
          </div>
        </div>
      )}

      {/* Accept + weigh + invoice. */}
      {!isUndo && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold text-navy">Aceptar y facturar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresá el peso y las medidas finales del envío consolidado. Se genera el CWR y la factura queda como
            "Pago requerido".
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="weightLb" className="mb-1.5 block text-sm font-medium text-navy">
                Peso final (lb) *
              </label>
              <input id="weightLb" inputMode="decimal" value={weightLb} onChange={(e) => setWeightLb(e.target.value)} className={inputCls} placeholder="0.00" />
            </div>
            <div>
              <label htmlFor="pieces" className="mb-1.5 block text-sm font-medium text-navy">
                Piezas
              </label>
              <input id="pieces" inputMode="numeric" value={pieces} onChange={(e) => setPieces(e.target.value)} className={inputCls} placeholder={String(members.length)} />
            </div>
            <div>
              <label htmlFor="lengthIn" className="mb-1.5 block text-sm font-medium text-navy">
                Largo (in)
              </label>
              <input id="lengthIn" inputMode="decimal" value={lengthIn} onChange={(e) => setLengthIn(e.target.value)} className={inputCls} placeholder="0" />
            </div>
            <div>
              <label htmlFor="widthIn" className="mb-1.5 block text-sm font-medium text-navy">
                Ancho (in)
              </label>
              <input id="widthIn" inputMode="decimal" value={widthIn} onChange={(e) => setWidthIn(e.target.value)} className={inputCls} placeholder="0" />
            </div>
            <div>
              <label htmlFor="heightIn" className="mb-1.5 block text-sm font-medium text-navy">
                Alto (in)
              </label>
              <input id="heightIn" inputMode="decimal" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className={inputCls} placeholder="0" />
            </div>
            <div>
              <label htmlFor="loc" className="mb-1.5 block text-sm font-medium text-navy">
                Ubicación en depósito
              </label>
              <input id="loc" value={warehouseLocation} onChange={(e) => setWarehouseLocation(e.target.value)} className={inputCls} placeholder="Ej: A-12" />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-navy">
              Notas (opcional)
            </label>
            <textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => cancelConsolidationRequest(id), true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-card px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              <Icons.Trash2 className="h-4 w-4" /> Cancelar solicitud
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={accept}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {pending ? "Procesando…" : "Aceptar y generar CWR"}
              <Icons.ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
