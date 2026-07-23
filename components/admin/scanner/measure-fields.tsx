"use client"

export type Measures = {
  pieces?: number
  weightLb?: number
  lengthIn?: number
  widthIn?: number
  heightIn?: number
  description?: string
  location?: string
}

function num(v: string): number | undefined {
  const n = Number(v)
  return v.trim() === "" || !Number.isFinite(n) ? undefined : n
}

/** Reusable measurement grid for consolidated shipments (weight / dims / etc.). */
export function MeasureFields({
  value,
  onChange,
  showContent = true,
  showLocation = true,
}: {
  value: Measures
  onChange: (m: Measures) => void
  showContent?: boolean
  showLocation?: boolean
}) {
  const set = (patch: Partial<Measures>) => onChange({ ...value, ...patch })

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <Field label="Piezas">
        <input
          type="number"
          min={1}
          inputMode="numeric"
          value={value.pieces ?? ""}
          onChange={(e) => set({ pieces: num(e.target.value) })}
          className={inputCls}
          placeholder="Auto"
        />
      </Field>
      <Field label="Peso (lb) *">
        <input
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          value={value.weightLb ?? ""}
          onChange={(e) => set({ weightLb: num(e.target.value) })}
          className={inputCls}
          placeholder="0.00"
        />
      </Field>
      <Field label="Largo (in)">
        <input
          type="number"
          min={0}
          step="0.1"
          inputMode="decimal"
          value={value.lengthIn ?? ""}
          onChange={(e) => set({ lengthIn: num(e.target.value) })}
          className={inputCls}
        />
      </Field>
      <Field label="Ancho (in)">
        <input
          type="number"
          min={0}
          step="0.1"
          inputMode="decimal"
          value={value.widthIn ?? ""}
          onChange={(e) => set({ widthIn: num(e.target.value) })}
          className={inputCls}
        />
      </Field>
      <Field label="Alto (in)">
        <input
          type="number"
          min={0}
          step="0.1"
          inputMode="decimal"
          value={value.heightIn ?? ""}
          onChange={(e) => set({ heightIn: num(e.target.value) })}
          className={inputCls}
        />
      </Field>
      {showLocation && (
        <Field label="Ubicación">
          <input
            value={value.location ?? ""}
            onChange={(e) => set({ location: e.target.value })}
            className={inputCls}
            placeholder="Ej: A-12"
          />
        </Field>
      )}
      {showContent && (
        <div className="col-span-2 sm:col-span-3">
          <Field label="Contenido / descripción">
            <input
              value={value.description ?? ""}
              onChange={(e) => set({ description: e.target.value })}
              className={inputCls}
              placeholder="Descripción del consolidado…"
            />
          </Field>
        </div>
      )}
    </div>
  )
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
