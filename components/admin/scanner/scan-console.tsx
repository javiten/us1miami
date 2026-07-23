"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle2,
  Loader2,
  RotateCcw,
  ScanLine,
  Trash2,
  Undo2,
  Volume2,
  VolumeX,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type ScanUnit = {
  key: string
  code: string
  title: string
  subtitle?: string
  meta?: string
  state: "pending" | "scanned" | "incident"
  incident?: string
}

export type ScanContext = {
  label: string
  value: string
  hint?: string
} | null

export type ScanResolveResult = {
  ok?: boolean
  unit?: ScanUnit
  pool?: ScanUnit[]
  context?: ScanContext
  error?: string
  warning?: string
}

export type IncidentOption = { value: string; label: string }

type Feedback = { kind: "success" | "error" | "warning"; message: string } | null

type Persisted = {
  scanned: ScanUnit[]
  pool: ScanUnit[]
  context: ScanContext
}

function beep(kind: "success" | "error") {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = "sine"
    osc.frequency.value = kind === "success" ? 880 : 220
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)
    osc.start()
    osc.stop(ctx.currentTime + 0.2)
    osc.onended = () => ctx.close()
  } catch {
    /* audio not available */
  }
}

export function ScanConsole({
  storageKey,
  mode,
  pendingLabel,
  scannedLabel,
  scanPlaceholder = "Escaneá o ingresá el código y presioná Enter",
  initialPending = [],
  resolveScan,
  allowIncidents = false,
  incidentOptions = [],
  minToComplete = 1,
  children,
}: {
  storageKey: string
  mode: "collect" | "verify"
  pendingLabel: string
  scannedLabel: string
  scanPlaceholder?: string
  initialPending?: ScanUnit[]
  resolveScan: (code: string, scannedKeys: string[]) => Promise<ScanResolveResult>
  allowIncidents?: boolean
  incidentOptions?: IncidentOption[]
  minToComplete?: number
  children?: (state: {
    units: ScanUnit[]
    context: ScanContext
    canComplete: boolean
    reset: () => void
  }) => React.ReactNode
}) {
  const [scanned, setScanned] = useState<ScanUnit[]>([])
  const [pool, setPool] = useState<ScanUnit[]>(mode === "verify" ? initialPending : [])
  const [context, setContext] = useState<ScanContext>(null)
  const [value, setValue] = useState("")
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [sound, setSound] = useState(true)
  const [hydrated, setHydrated] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastScan = useRef<{ code: string; at: number }>({ code: "", at: 0 })
  const fbTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // --- Hydrate from localStorage (resume after refresh) --------------------
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as Persisted
        if (parsed.scanned?.length || parsed.context) {
          setScanned(parsed.scanned ?? [])
          if (mode === "collect") setPool(parsed.pool ?? [])
          setContext(parsed.context ?? null)
        }
      }
      const s = localStorage.getItem(`${storageKey}:sound`)
      if (s != null) setSound(s === "1")
    } catch {
      /* ignore */
    }
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  // --- Persist active session ----------------------------------------------
  useEffect(() => {
    if (!hydrated) return
    try {
      if (scanned.length === 0 && !context) {
        localStorage.removeItem(storageKey)
      } else {
        const payload: Persisted = { scanned, pool: mode === "collect" ? pool : [], context }
        localStorage.setItem(storageKey, JSON.stringify(payload))
      }
    } catch {
      /* ignore */
    }
  }, [scanned, pool, context, hydrated, storageKey, mode])

  const focusInput = useCallback(() => {
    // Keep the scan field focused for uninterrupted USB-scanner input.
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  useEffect(() => {
    focusInput()
  }, [focusInput])

  const scannedKeys = useMemo(() => new Set(scanned.map((u) => u.key)), [scanned])
  const pendingUnits = useMemo(() => pool.filter((u) => !scannedKeys.has(u.key)), [pool, scannedKeys])

  const showFeedback = useCallback(
    (fb: Feedback) => {
      setFeedback(fb)
      if (fb && sound) beep(fb.kind === "success" ? "success" : "error")
      if (fbTimer.current) clearTimeout(fbTimer.current)
      fbTimer.current = setTimeout(() => setFeedback(null), 3000)
    },
    [sound],
  )

  const handleScan = useCallback(
    async (rawCode: string) => {
      const code = rawCode.trim()
      if (!code || busy) return

      // Debounce identical rapid double-scans (scanner bounce).
      const now = Date.now()
      if (lastScan.current.code === code && now - lastScan.current.at < 900) {
        setValue("")
        return
      }
      lastScan.current = { code, at: now }

      // Client-side duplicate guard for already-scanned units.
      if (scanned.some((u) => u.code.toUpperCase() === code.toUpperCase())) {
        showFeedback({ kind: "warning", message: `${code} ya fue escaneado.` })
        setValue("")
        return
      }

      setBusy(true)
      try {
        const res = await resolveScan(code, Array.from(scannedKeys))
        if (res.error || !res.unit) {
          showFeedback({ kind: "error", message: res.error ?? "Código no válido." })
          setValue("")
          return
        }
        if (res.context !== undefined) setContext(res.context)
        if (res.pool) setPool(res.pool)
        const unit = { ...res.unit, state: "scanned" as const }
        setScanned((prev) => (prev.some((u) => u.key === unit.key) ? prev : [...prev, unit]))
        showFeedback({
          kind: res.warning ? "warning" : "success",
          message: res.warning ?? `${unit.title} agregado.`,
        })
      } catch {
        showFeedback({ kind: "error", message: "Error de conexión. Reintentá." })
      } finally {
        setBusy(false)
        setValue("")
        focusInput()
      }
    },
    [busy, resolveScan, scanned, scannedKeys, showFeedback, focusInput],
  )

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    e.preventDefault()
    void handleScan(value)
  }

  function undoLast() {
    setScanned((prev) => prev.slice(0, -1))
    focusInput()
  }

  function removeUnit(key: string) {
    setScanned((prev) => prev.filter((u) => u.key !== key))
    focusInput()
  }

  function markIncident(unit: ScanUnit, incident: string) {
    setScanned((prev) =>
      prev.some((u) => u.key === unit.key)
        ? prev
        : [...prev, { ...unit, state: "incident" as const, incident }],
    )
    if (sound) beep("error")
    focusInput()
  }

  function reset() {
    setScanned([])
    if (mode === "collect") {
      setPool([])
      setContext(null)
    }
    setFeedback(null)
    try {
      localStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
    focusInput()
  }

  function toggleSound() {
    setSound((s) => {
      const next = !s
      try {
        localStorage.setItem(`${storageKey}:sound`, next ? "1" : "0")
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const total = mode === "verify" ? pool.length : scanned.length + pendingUnits.length
  const doneCount = scanned.length
  const canComplete =
    mode === "verify" ? pool.length > 0 && pendingUnits.length === 0 : scanned.length >= minToComplete
  const progressLabel = mode === "verify" ? `${doneCount} de ${total || 0}` : `${doneCount} escaneado${doneCount === 1 ? "" : "s"}`
  const progressPct = total > 0 ? Math.round((doneCount / total) * 100) : 0

  return (
    <div className="space-y-5">
      {/* Context banner */}
      {context && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">{context.label}</span>
          <span className="text-sm font-bold text-navy">{context.value}</span>
          {context.hint && <span className="text-xs text-muted-foreground">{context.hint}</span>}
        </div>
      )}

      {/* Scan field */}
      <div
        className={cn(
          "rounded-2xl border-2 bg-card p-4 shadow-sm transition-colors",
          feedback?.kind === "success" && "border-emerald-400",
          feedback?.kind === "error" && "border-red-400",
          feedback?.kind === "warning" && "border-amber-400",
          !feedback && "border-primary/30",
        )}
        onClick={focusInput}
      >
        <div className="flex items-center gap-3">
          <ScanLine className="h-6 w-6 shrink-0 text-primary" />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={focusInput}
            inputMode="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder={scanPlaceholder}
            aria-label="Campo de escaneo"
            className="h-14 w-full bg-transparent text-2xl font-bold tracking-wide text-navy outline-none placeholder:text-base placeholder:font-normal placeholder:text-muted-foreground"
          />
          {busy && <Loader2 className="h-6 w-6 shrink-0 animate-spin text-primary" />}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleSound()
            }}
            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted"
            aria-label={sound ? "Silenciar sonidos" : "Activar sonidos"}
            title={sound ? "Silenciar sonidos" : "Activar sonidos"}
          >
            {sound ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>

        {feedback && (
          <div
            className={cn(
              "mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
              feedback.kind === "success" && "bg-emerald-50 text-emerald-700",
              feedback.kind === "error" && "bg-red-50 text-red-700",
              feedback.kind === "warning" && "bg-amber-50 text-amber-700",
            )}
            role="status"
          >
            {feedback.kind === "success" && <CheckCircle2 className="h-4 w-4" />}
            {feedback.kind === "error" && <XCircle className="h-4 w-4" />}
            {feedback.kind === "warning" && <AlertTriangle className="h-4 w-4" />}
            {feedback.message}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-navy">
          <span className="tabular-nums">{progressLabel}</span>
        </div>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <button
          type="button"
          onClick={undoLast}
          disabled={scanned.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-muted disabled:opacity-40"
        >
          <Undo2 className="h-3.5 w-3.5" /> Deshacer
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={scanned.length === 0 && !context}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reiniciar
        </button>
      </div>

      {/* Two columns */}
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <Column
          title={pendingLabel}
          count={pendingUnits.length}
          tone="pending"
          empty={
            mode === "collect"
              ? "Escaneá el primer código para comenzar."
              : "Todo verificado."
          }
        >
          {pendingUnits.map((u) => (
            <UnitRow
              key={u.key}
              unit={u}
              actions={
                allowIncidents && mode === "verify" ? (
                  <IncidentMenu options={incidentOptions} onPick={(inc) => markIncident(u, inc)} />
                ) : null
              }
            />
          ))}
        </Column>

        <div className="hidden items-center justify-center lg:flex">
          <ArrowLeftRight className="h-6 w-6 text-muted-foreground" />
        </div>

        <Column title={scannedLabel} count={scanned.length} tone="scanned" empty="Aún no hay unidades.">
          {scanned.map((u) => (
            <UnitRow
              key={u.key}
              unit={u}
              actions={
                <button
                  type="button"
                  onClick={() => removeUnit(u.key)}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label={`Quitar ${u.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              }
            />
          ))}
        </Column>
      </div>

      {/* Completion panel (render prop) */}
      {children?.({ units: scanned, context, canComplete, reset })}
    </div>
  )
}

function Column({
  title,
  count,
  tone,
  empty,
  children,
}: {
  title: string
  count: number
  tone: "pending" | "scanned"
  empty: string
  children: React.ReactNode
}) {
  const isEmpty = Array.isArray(children) ? children.length === 0 : !children
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-navy">{title}</h3>
        <span
          className={cn(
            "inline-flex min-w-7 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold",
            tone === "scanned" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-navy",
          )}
        >
          {count}
        </span>
      </div>
      <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
        {isEmpty ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{empty}</p>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

function UnitRow({ unit, actions }: { unit: ScanUnit; actions?: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5",
        unit.state === "incident" ? "border-red-200 bg-red-50" : "border-border bg-background",
      )}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-navy">{unit.title}</p>
        {unit.subtitle && <p className="truncate text-xs text-muted-foreground">{unit.subtitle}</p>}
        {unit.incident && (
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-red-600">
            <AlertTriangle className="h-3 w-3" /> {unit.incident}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {unit.meta && <span className="text-xs font-medium text-muted-foreground">{unit.meta}</span>}
        {actions}
      </div>
    </div>
  )
}

function IncidentMenu({
  options,
  onPick,
}: {
  options: IncidentOption[]
  onPick: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-md border border-border p-1 text-muted-foreground transition-colors hover:bg-amber-50 hover:text-amber-600"
        aria-label="Marcar incidente"
      >
        <AlertTriangle className="h-3.5 w-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onPick(opt.value)
                  setOpen(false)
                }}
                className="block w-full px-3 py-2 text-left text-xs font-medium text-navy transition-colors hover:bg-muted"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
