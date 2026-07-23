"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Loader2, PackageSearch, ScanLine } from "lucide-react"
import { ScanConsole, type ScanUnit } from "@/components/admin/scanner/scan-console"
import { PhotoCapture, type CapturedPhoto } from "@/components/admin/photo-capture"
import {
  loadCwrForDeconsolidation,
  completeCwrDeconsolidation,
  type CwrContents,
} from "@/app/actions/consolidation-actions"
import { PACKAGE_INCIDENTS } from "@/lib/constants"

const INCIDENT_OPTIONS = Object.entries(PACKAGE_INCIDENTS).map(([value, label]) => ({ value, label }))

export function DeconsolidateCwrWorkflow({ initialCwr }: { initialCwr?: string }) {
  const [cwr, setCwr] = useState<CwrContents | null>(null)
  const [code, setCode] = useState(initialCwr ?? "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function lookup(value?: string) {
    const c = (value ?? code).trim()
    if (!c) return
    setLoading(true)
    setError(null)
    try {
      const res = await loadCwrForDeconsolidation(c)
      if (res.error) setError(res.error)
      else if (res.cwr) setCwr(res.cwr)
    } finally {
      setLoading(false)
    }
  }

  // Auto-load when arriving from the CWR label QR (?cwr=CWR-123).
  useEffect(() => {
    if (initialCwr) void lookup(initialCwr)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCwr])

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h2 className="mt-3 text-xl font-bold text-emerald-800">CWR desconsolidado</h2>
        <p className="mt-1 text-emerald-700">
          {cwr?.cwrNumber} desarmado. Los WR quedaron listos para entrega y se notificó al cliente.
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false)
            setCwr(null)
            setCode("")
          }}
          className="mt-5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Desconsolidar otro
        </button>
      </div>
    )
  }

  if (!cwr) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <label className="mb-2 block text-sm font-medium text-foreground">Escaneá el consolidado (CWR)</label>
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
              placeholder="CWR-XXXXX"
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="button"
            onClick={() => lookup()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageSearch className="h-4 w-4" />} Cargar
          </button>
        </div>
        {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}
      </div>
    )
  }

  return <VerifyCwr cwr={cwr} onDone={() => setDone(true)} />
}

function VerifyCwr({ cwr, onDone }: { cwr: CwrContents; onDone: () => void }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [photos, setPhotos] = useState<CapturedPhoto[]>([])

  async function complete(units: ScanUnit[]) {
    setError(null)
    setSaving(true)
    try {
      const res = await completeCwrDeconsolidation({
        cwrId: cwr.id,
        units: units.map((u) => ({
          key: u.key,
          state: u.state === "incident" ? "incident" : "scanned",
          incident: u.incident,
        })),
        warehouseLocation: location.trim() || undefined,
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
      storageKey={`deconsolidate-cwr:${cwr.id}`}
      mode="verify"
      pendingLabel="WR por verificar"
      scannedLabel="WR verificados"
      scanPlaceholder="Escaneá cada WR del consolidado"
      initialPending={cwr.units}
      resolveScan={async (raw, scannedKeys) => {
        const norm = raw.trim().toUpperCase()
        const match = cwr.units.find((u) => u.code.toUpperCase() === norm)
        if (!match) return { error: `${raw} no pertenece a ${cwr.cwrNumber}.` }
        if (scannedKeys.includes(match.key)) return { warning: `${match.code} ya fue verificado.` }
        return { ok: true, unit: { ...match, state: "scanned" } }
      }}
      allowIncidents
      incidentOptions={INCIDENT_OPTIONS}
      minToComplete={cwr.units.length}
    >
      {({ units, canComplete }) => (
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">
            Desconsolidar {cwr.cwrNumber}
            {cwr.customerName ? ` · ${cwr.customerName}` : ""}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Verificá los {cwr.units.length} WR. Al confirmar quedarán listos para entrega y se notificará al cliente.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Ubicación de entrega</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Estante B-04"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Notas</span>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
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
            {saving ? "Guardando…" : "Confirmar y notificar al cliente"}
          </button>
        </div>
      )}
    </ScanConsole>
  )
}
