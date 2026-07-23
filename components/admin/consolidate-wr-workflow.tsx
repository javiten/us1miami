"use client"

import { useState } from "react"
import { CheckCircle2, Combine, Loader2 } from "lucide-react"
import { ScanConsole, type ScanContext, type ScanUnit } from "@/components/admin/scanner/scan-console"
import { PhotoCapture, type CapturedPhoto } from "@/components/admin/photo-capture"
import { MeasureFields, type Measures } from "@/components/admin/scanner/measure-fields"
import { scanWrForConsolidation, createCwr } from "@/app/actions/consolidation-actions"

export function ConsolidateWrWorkflow() {
  const [done, setDone] = useState<{ cwrNumber: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [measures, setMeasures] = useState<Measures>({})
  const [photos, setPhotos] = useState<CapturedPhoto[]>([])
  const [notes, setNotes] = useState("")

  async function finalize(units: ScanUnit[], reset: () => void) {
    setError(null)
    if (!measures.weightLb) {
      setError("Ingresá el peso final del consolidado.")
      return
    }
    setSaving(true)
    try {
      const res = await createCwr({
        unitKeys: units.map((u) => u.key),
        pieces: measures.pieces,
        weightLb: measures.weightLb,
        lengthIn: measures.lengthIn,
        widthIn: measures.widthIn,
        heightIn: measures.heightIn,
        description: measures.description,
        warehouseLocation: measures.location,
        notes: notes.trim() || undefined,
        photos: photos.map((p) => p.pathname),
      })
      if (res.error) {
        setError(res.error)
        return
      }
      if (res.ok && res.cwrNumber) {
        setDone({ cwrNumber: res.cwrNumber })
        reset()
        setMeasures({})
        setPhotos([])
        setNotes("")
      }
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h2 className="mt-3 text-xl font-bold text-emerald-800">CWR creado</h2>
        <p className="mt-1 text-emerald-700">
          Consolidado <span className="font-bold">{done.cwrNumber}</span> generado correctamente.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href={`/admin/cwr/${encodeURIComponent(done.cwrNumber)}/label`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Imprimir etiqueta CWR
          </a>
          <button
            type="button"
            onClick={() => setDone(null)}
            className="rounded-lg border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            Consolidar otro
          </button>
        </div>
      </div>
    )
  }

  return (
    <ScanConsole
      storageKey="consolidate-wr"
      mode="collect"
      pendingLabel="WR escaneados"
      scannedLabel="WR en este consolidado"
      scanPlaceholder="Escaneá el WR y presioná Enter"
      resolveScan={scanWrForConsolidation}
      minToComplete={2}
    >
      {({ units, context, canComplete, reset }) => (
        <FinalizePanel
          units={units}
          context={context}
          canComplete={canComplete}
          reset={reset}
          measures={measures}
          setMeasures={setMeasures}
          photos={photos}
          setPhotos={setPhotos}
          notes={notes}
          setNotes={setNotes}
          error={error}
          saving={saving}
          onFinalize={() => finalize(units, reset)}
        />
      )}
    </ScanConsole>
  )
}

function FinalizePanel({
  units,
  canComplete,
  measures,
  setMeasures,
  photos,
  setPhotos,
  notes,
  setNotes,
  error,
  saving,
  onFinalize,
}: {
  units: ScanUnit[]
  context: ScanContext
  canComplete: boolean
  reset: () => void
  measures: Measures
  setMeasures: (m: Measures) => void
  photos: CapturedPhoto[]
  setPhotos: (p: CapturedPhoto[]) => void
  notes: string
  setNotes: (v: string) => void
  error: string | null
  saving: boolean
  onFinalize: () => void
}) {
  return (
    <div className="mt-4 rounded-2xl border border-border bg-card p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Combine className="h-4 w-4 text-primary" /> Datos del consolidado
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Ingresá el peso y medidas finales del paquete consolidado antes de cerrar el CWR.
      </p>

      <div className="mt-4">
        <MeasureFields value={measures} onChange={setMeasures} />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Notas (opcional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Observaciones del consolidado…"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Fotos del consolidado</label>
        <PhotoCapture photos={photos} onChange={setPhotos} />
      </div>

      {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}

      <button
        type="button"
        onClick={onFinalize}
        disabled={!canComplete || saving}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Combine className="h-4 w-4" />}
        {saving ? "Creando CWR…" : `Crear CWR (${units.length} WR)`}
      </button>
    </div>
  )
}
