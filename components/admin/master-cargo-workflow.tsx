"use client"

import { useState } from "react"
import { CheckCircle2, Container, FileText, Loader2, Plane } from "lucide-react"
import { ScanConsole, type ScanContext, type ScanUnit } from "@/components/admin/scanner/scan-console"
import { PhotoCapture, type CapturedPhoto } from "@/components/admin/photo-capture"
import { MeasureFields, type Measures } from "@/components/admin/scanner/measure-fields"
import { scanUnitForMaster, createMc, generateMawb } from "@/app/actions/consolidation-actions"

export function MasterCargoWorkflow() {
  const [done, setDone] = useState<{ mcNumber: string; mcId: number; mawbNumber?: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [mawbBusy, setMawbBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [measures, setMeasures] = useState<Measures>({})
  const [photos, setPhotos] = useState<CapturedPhoto[]>([])
  const [seal, setSeal] = useState("")
  const [destination, setDestination] = useState("Buenos Aires, AR")
  const [service, setService] = useState("Aéreo")
  const [notes, setNotes] = useState("")

  async function finalize(units: ScanUnit[], reset: () => void) {
    setError(null)
    setSaving(true)
    try {
      const res = await createMc({
        unitKeys: units.map((u) => u.key),
        sealNumber: seal.trim() || undefined,
        destination: destination.trim() || undefined,
        service: service.trim() || undefined,
        weightLb: measures.weightLb,
        lengthIn: measures.lengthIn,
        widthIn: measures.widthIn,
        heightIn: measures.heightIn,
        notes: notes.trim() || undefined,
        photos: photos.map((p) => p.pathname),
      })
      if (res.error) {
        setError(res.error)
        return
      }
      if (res.ok && res.mcNumber && res.mcId) {
        setDone({ mcNumber: res.mcNumber, mcId: res.mcId })
        reset()
        setMeasures({})
        setPhotos([])
        setSeal("")
        setNotes("")
      }
    } finally {
      setSaving(false)
    }
  }

  async function makeMawb() {
    if (!done) return
    setMawbBusy(true)
    try {
      const res = await generateMawb(done.mcId)
      if (res.ok && res.mawbNumber) setDone({ ...done, mawbNumber: res.mawbNumber })
    } finally {
      setMawbBusy(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h2 className="mt-3 text-xl font-bold text-emerald-800">Carga maestra creada</h2>
        <p className="mt-1 text-emerald-700">
          <span className="font-bold">{done.mcNumber}</span> generada correctamente.
          {done.mawbNumber && (
            <>
              {" "}
              MAWB: <span className="font-bold">{done.mawbNumber}</span>
            </>
          )}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {!done.mawbNumber && (
            <button
              type="button"
              onClick={makeMawb}
              disabled={mawbBusy}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              {mawbBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plane className="h-4 w-4" />}
              Generar MAWB
            </button>
          )}
          <a
            href={`/admin/mc/${encodeURIComponent(done.mcNumber)}/manifiesto`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            <FileText className="h-4 w-4" /> Manifiesto de carga
          </a>
          <button
            type="button"
            onClick={() => setDone(null)}
            className="rounded-lg border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            Crear otra
          </button>
        </div>
      </div>
    )
  }

  return (
    <ScanConsole
      storageKey="master-cargo"
      mode="collect"
      pendingLabel="Unidades escaneadas"
      scannedLabel="Unidades en esta carga maestra"
      scanPlaceholder="Escaneá un CWR o WR y presioná Enter"
      resolveScan={scanUnitForMaster}
      minToComplete={1}
    >
      {({ units, canComplete, reset }) => (
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Container className="h-4 w-4 text-primary" /> Datos de la carga maestra
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Podés mezclar CWR de distintos clientes y WR sueltos en una misma carga maestra.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Precinto / Sello</span>
              <input
                value={seal}
                onChange={(e) => setSeal(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="N° de precinto"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Destino</span>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Servicio</span>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option>Aéreo</option>
                <option>Marítimo</option>
                <option>Courier</option>
              </select>
            </label>
          </div>

          <div className="mt-3">
            <MeasureFields value={measures} onChange={setMeasures} showContent={false} showLocation={false} />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Notas (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Fotos de la carga</label>
            <PhotoCapture photos={photos} onChange={setPhotos} />
          </div>

          {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}

          <button
            type="button"
            onClick={() => finalize(units, reset)}
            disabled={!canComplete || saving}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Container className="h-4 w-4" />}
            {saving ? "Creando carga maestra…" : `Crear carga maestra (${units.length})`}
          </button>
        </div>
      )}
    </ScanConsole>
  )
}
