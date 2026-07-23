"use client"

import { useState } from "react"
import { CheckCircle2, Loader2, PackageOpen, ScanLine } from "lucide-react"
import { ScanConsole, type ScanUnit } from "@/components/admin/scanner/scan-console"
import { PhotoCapture, type CapturedPhoto } from "@/components/admin/photo-capture"
import {
  loadMcForDeconsolidation,
  completeMcDeconsolidation,
  type McContents,
} from "@/app/actions/consolidation-actions"
import { PACKAGE_INCIDENTS } from "@/lib/constants"

const INCIDENT_OPTIONS = Object.entries(PACKAGE_INCIDENTS).map(([value, label]) => ({ value, label }))

export function DeconsolidateMcWorkflow() {
  const [mc, setMc] = useState<McContents | null>(null)
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function lookup() {
    const c = code.trim()
    if (!c) return
    setLoading(true)
    setError(null)
    try {
      const res = await loadMcForDeconsolidation(c)
      if (res.error) setError(res.error)
      else if (res.mc) setMc(res.mc)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h2 className="mt-3 text-xl font-bold text-emerald-800">Carga desconsolidada</h2>
        <p className="mt-1 text-emerald-700">
          {mc?.mcNumber} recibida en Argentina. Los CWR y WR verificados quedaron listos para su ruta.
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false)
            setMc(null)
            setCode("")
          }}
          className="mt-5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Desconsolidar otra
        </button>
      </div>
    )
  }

  if (!mc) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <label className="mb-2 block text-sm font-medium text-foreground">Escaneá la carga maestra (MC) recibida</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <ScanLine className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <input
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                  e.preventDefault()
                  void lookup()
                }
              }}
              placeholder="MC-XXXXX"
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="button"
            onClick={lookup}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageOpen className="h-4 w-4" />} Cargar
          </button>
        </div>
        {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}
      </div>
    )
  }

  return <VerifyMc mc={mc} onDone={() => setDone(true)} />
}

function VerifyMc({ mc, onDone }: { mc: McContents; onDone: () => void }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [photos, setPhotos] = useState<CapturedPhoto[]>([])

  async function complete(units: ScanUnit[]) {
    setError(null)
    setSaving(true)
    try {
      const res = await completeMcDeconsolidation({
        mcId: mc.id,
        units: units.map((u) => ({
          key: u.key,
          state: u.state === "incident" ? "incident" : "scanned",
          incident: u.incident,
        })),
        notes: notes.trim() || undefined,
        photos: photos.map((p) => p.pathname),
      })
      if (res.error) setError(res.error)
      else if (res.ok) onDone()
    } finally {
      setSaving(false)
    }
  }

  return (
    <ScanConsole
      storageKey={`deconsolidate-mc:${mc.id}`}
      mode="verify"
      pendingLabel="Faltan por verificar"
      scannedLabel="Verificados"
      scanPlaceholder="Escaneá cada CWR / WR para verificar"
      initialPending={mc.units}
      resolveScan={async (raw, scannedKeys) => {
        const norm = raw.trim().toUpperCase()
        const match = mc.units.find((u) => u.code.toUpperCase() === norm)
        if (!match) return { error: `${raw} no pertenece a ${mc.mcNumber}.` }
        if (scannedKeys.includes(match.key)) return { warning: `${match.code} ya fue verificado.` }
        return { ok: true, unit: { ...match, state: "scanned" } }
      }}
      allowIncidents
      incidentOptions={INCIDENT_OPTIONS}
      minToComplete={mc.units.length}
    >
      {({ units, canComplete }) => (
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">Cierre de desconsolidación</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Verificá las {mc.units.length} unidades. Marcá incidencias (faltante / dañado) en las que correspondan.
          </p>
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Notas de recepción</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Fotos (opcional)</label>
            <PhotoCapture photos={photos} onChange={setPhotos} />
          </div>
          {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}
          <button
            type="button"
            onClick={() => complete(units)}
            disabled={!canComplete || saving}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {saving ? "Guardando…" : "Confirmar recepción en Argentina"}
          </button>
        </div>
      )}
    </ScanConsole>
  )
}
