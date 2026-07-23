"use client"

import { useState, useTransition } from "react"
import { Check, ChevronLeft, ChevronRight, Package, Printer, Search, User } from "lucide-react"
import {
  searchCustomers,
  getCustomerPrealerts,
  receivePackage,
  type ReceptionState,
} from "@/app/actions/reception-actions"
import { PhotoCapture, type CapturedPhoto } from "@/components/admin/photo-capture"

type Customer = { id: string; name: string; email: string; boxNumber: string | null }
type Prealert = {
  id: number
  store: string
  trackingNumber: string | null
  carrier: string | null
  description: string | null
}

const STEPS = ["Cliente", "Detalles", "Fotos", "Confirmar"]

export function ReceptionWizard({ workstation }: { workstation: string }) {
  const [step, setStep] = useState(0)
  const [pending, startTransition] = useTransition()

  // Step 1
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Customer[]>([])
  const [searching, setSearching] = useState(false)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [prealerts, setPrealerts] = useState<Prealert[]>([])
  const [prealertId, setPrealertId] = useState<number | null>(null)

  // Step 2
  const [form, setForm] = useState({
    trackingNumber: "",
    carrier: "",
    store: "",
    description: "",
    declaredValue: "",
    weightLb: "",
    lengthIn: "",
    widthIn: "",
    heightIn: "",
    warehouseLocation: "",
    notes: "",
  })

  // Step 3
  const [photos, setPhotos] = useState<CapturedPhoto[]>([])

  // Result
  const [result, setResult] = useState<ReceptionState | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function runSearch(q: string) {
    setQuery(q)
    if (q.trim().length < 2) {
      setResults([])
      return
    }
    setSearching(true)
    try {
      const rows = await searchCustomers(q)
      setResults(rows as Customer[])
    } finally {
      setSearching(false)
    }
  }

  async function pickCustomer(c: Customer) {
    setCustomer(c)
    setResults([])
    setQuery(`${c.name}${c.boxNumber ? ` · ${c.boxNumber}` : ""}`)
    const pa = await getCustomerPrealerts(c.id)
    setPrealerts(pa as Prealert[])
  }

  function applyPrealert(pa: Prealert) {
    setPrealertId(pa.id)
    setForm((f) => ({
      ...f,
      store: pa.store ?? f.store,
      trackingNumber: pa.trackingNumber ?? f.trackingNumber,
      carrier: pa.carrier ?? f.carrier,
      description: pa.description ?? f.description,
    }))
  }

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const canNext =
    (step === 0 && !!customer) ||
    (step === 1 && Number.parseFloat(form.weightLb) > 0) ||
    (step === 2 && photos.length > 0) ||
    step === 3

  function finalize() {
    if (!customer) return
    setError(null)
    startTransition(async () => {
      const res = await receivePackage({
        userId: customer.id,
        trackingNumber: form.trackingNumber,
        carrier: form.carrier,
        store: form.store,
        description: form.description,
        declaredValue: form.declaredValue ? Number.parseFloat(form.declaredValue) : undefined,
        weightLb: Number.parseFloat(form.weightLb),
        lengthIn: form.lengthIn ? Number.parseFloat(form.lengthIn) : undefined,
        widthIn: form.widthIn ? Number.parseFloat(form.widthIn) : undefined,
        heightIn: form.heightIn ? Number.parseFloat(form.heightIn) : undefined,
        warehouseLocation: form.warehouseLocation,
        notes: form.notes,
        photos: photos.map((p) => p.pathname),
        prealertId: prealertId ?? undefined,
        workstation,
      })
      if (res.error) {
        setError(res.error)
        return
      }
      setResult(res)
      setStep(4)
    })
  }

  function reset() {
    setStep(0)
    setQuery("")
    setResults([])
    setCustomer(null)
    setPrealerts([])
    setPrealertId(null)
    setForm({
      trackingNumber: "",
      carrier: "",
      store: "",
      description: "",
      declaredValue: "",
      weightLb: "",
      lengthIn: "",
      widthIn: "",
      heightIn: "",
      warehouseLocation: "",
      notes: "",
    })
    setPhotos([])
    setResult(null)
    setError(null)
  }

  if (step === 4 && result?.ok) {
    return (
      <ReceptionReceipt
        wrNumber={result.wrNumber ?? ""}
        customerName={customer?.name ?? ""}
        boxNumber={customer?.boxNumber ?? ""}
        weightLb={form.weightLb}
        store={form.store}
        onReset={reset}
      />
    )
  }

  return (
    <div>
      {/* Stepper */}
      <ol className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => {
          const active = i === step
          const done = i < step
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "bg-primary/15 text-primary ring-2 ring-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`hidden text-sm sm:block ${active ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="mx-1 hidden h-px flex-1 bg-border sm:block" />}
            </li>
          )
        })}
      </ol>

      <div className="rounded-2xl border border-border bg-card p-6">
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Buscar cliente</h2>
              <p className="text-sm text-muted-foreground">Buscá por nombre, email o número de casillero.</p>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => runSearch(e.target.value)}
                placeholder="Ej: María, maria@mail.com, US1-1001"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {searching && <p className="text-sm text-muted-foreground">Buscando...</p>}
            {results.length > 0 && (
              <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                {results.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => pickCustomer(c)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-foreground">{c.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">{c.email}</span>
                      </span>
                      <span className="ml-auto rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        {c.boxNumber ?? "Sin casillero"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {customer && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p className="text-sm font-semibold text-foreground">{customer.name}</p>
                <p className="text-xs text-muted-foreground">
                  {customer.email} · Casillero {customer.boxNumber ?? "se asignará al recibir"}
                </p>
                {prealerts.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Prealertas abiertas — tocá para vincular:</p>
                    <div className="flex flex-wrap gap-2">
                      {prealerts.map((pa) => (
                        <button
                          key={pa.id}
                          type="button"
                          onClick={() => applyPrealert(pa)}
                          className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                            prealertId === pa.id
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card hover:bg-muted"
                          }`}
                        >
                          {pa.store}
                          {pa.trackingNumber ? ` · ${pa.trackingNumber}` : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Detalles del paquete</h2>
              <p className="text-sm text-muted-foreground">El peso es obligatorio. El resto ayuda a identificar el envío.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tienda / Remitente" value={form.store} onChange={(v) => set("store", v)} placeholder="Amazon, Apple..." />
              <Field label="Transportista" value={form.carrier} onChange={(v) => set("carrier", v)} placeholder="UPS, USPS, FedEx" />
              <Field label="Tracking" value={form.trackingNumber} onChange={(v) => set("trackingNumber", v)} placeholder="1Z..." />
              <Field label="Valor declarado (USD)" type="number" value={form.declaredValue} onChange={(v) => set("declaredValue", v)} placeholder="0.00" />
              <div className="sm:col-span-2">
                <Field label="Descripción del contenido" value={form.description} onChange={(v) => set("description", v)} placeholder="2 pares de zapatillas, 1 remera" />
              </div>
              <Field label="Peso (lb) *" type="number" value={form.weightLb} onChange={(v) => set("weightLb", v)} placeholder="0.0" />
              <Field label="Ubicación en depósito" value={form.warehouseLocation} onChange={(v) => set("warehouseLocation", v)} placeholder="Estante A-12" />
              <Field label="Largo (in)" type="number" value={form.lengthIn} onChange={(v) => set("lengthIn", v)} />
              <Field label="Ancho (in)" type="number" value={form.widthIn} onChange={(v) => set("widthIn", v)} />
              <Field label="Alto (in)" type="number" value={form.heightIn} onChange={(v) => set("heightIn", v)} />
            </div>
            <Field label="Notas internas" value={form.notes} onChange={(v) => set("notes", v)} placeholder="Caja dañada, requiere revisión..." />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Fotos del paquete</h2>
              <p className="text-sm text-muted-foreground">Capturá al menos una foto. Se guardan de forma segura.</p>
            </div>
            <PhotoCapture photos={photos} onChange={setPhotos} />
          </div>
        )}

        {step === 3 && customer && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Confirmar recepción</h2>
              <p className="text-sm text-muted-foreground">Revisá los datos antes de generar el WR.</p>
            </div>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Summary label="Cliente" value={customer.name} />
              <Summary label="Casillero" value={customer.boxNumber ?? "Se asignará"} />
              <Summary label="Tienda" value={form.store || "—"} />
              <Summary label="Tracking" value={form.trackingNumber || "—"} />
              <Summary label="Peso" value={`${form.weightLb || "0"} lb`} />
              <Summary label="Valor declarado" value={form.declaredValue ? `USD ${form.declaredValue}` : "—"} />
              <Summary label="Ubicación" value={form.warehouseLocation || "—"} />
              <Summary label="Fotos" value={`${photos.length}`} />
            </dl>
            {form.description && <Summary label="Contenido" value={form.description} />}
            {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          </div>
        )}

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || pending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Atrás
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-40"
            >
              Siguiente <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={finalize}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-60"
            >
              <Package className="h-4 w-4" /> {pending ? "Generando WR..." : "Confirmar y generar WR"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        type={type}
        inputMode={type === "number" ? "decimal" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

function ReceptionReceipt({
  wrNumber,
  customerName,
  boxNumber,
  weightLb,
  store,
  onReset,
}: {
  wrNumber: string
  customerName: string
  boxNumber: string
  weightLb: string
  store: string
  onReset: () => void
}) {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Paquete recibido</h2>
        <p className="mt-1 text-sm text-muted-foreground">El cliente ya puede verlo en su panel.</p>

        <div id="wr-label" className="mt-6 rounded-xl border-2 border-dashed border-border p-5 text-left">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-lg font-black tracking-tight text-foreground">US1 MIAMI</span>
            <span className="rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">{boxNumber}</span>
          </div>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground">{wrNumber}</p>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Cliente</dt>
              <dd className="font-medium text-foreground">{customerName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Peso</dt>
              <dd className="font-medium text-foreground">{weightLb} lb</dd>
            </div>
            {store && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tienda</dt>
                <dd className="font-medium text-foreground">{store}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => window.open(`/admin/wr/${encodeURIComponent(wrNumber)}/label`, "_blank", "noopener")}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Printer className="h-4 w-4" /> Imprimir etiqueta
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            <Package className="h-4 w-4" /> Nueva recepción
          </button>
        </div>
      </div>
    </div>
  )
}
