"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import * as Icons from "lucide-react"
import {
  confirmManualPayment,
  cancelInvoice,
  reopenInvoice,
  addInvoiceNote,
  recalculateInvoice,
  resolveReviewInvoice,
  type PayState,
} from "@/app/actions/invoice-actions"

type Panel = "confirm" | "cancel" | "review" | "note" | null

export function InvoiceActionsPanel({
  invoiceId,
  status,
  paymentMethod,
  billableWeightKg,
}: {
  invoiceId: number
  status: string
  paymentMethod: string | null
  billableWeightKg: string | null
}) {
  const router = useRouter()
  const [panel, setPanel] = useState<Panel>(null)
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<PayState | null>(null)

  // form fields
  const [reference, setReference] = useState("")
  const [notes, setNotes] = useState("")
  const [reason, setReason] = useState("")
  const [rate, setRate] = useState("")
  const [note, setNote] = useState("")

  function run(fn: () => Promise<PayState>, close = true) {
    setMsg(null)
    startTransition(async () => {
      const res = await fn()
      setMsg(res)
      if (res.ok) {
        if (close) setPanel(null)
        setReference("")
        setNotes("")
        setReason("")
        setRate("")
        setNote("")
        router.refresh()
      }
    })
  }

  const canConfirm = status === "PENDING_MANUAL_PAYMENT"
  const isReview = status === "REQUIRES_REVIEW"
  const canCancel = status !== "PAID" && status !== "CANCELLED"
  const canReopen = status === "CANCELLED"
  const canRecalc = status !== "PAID" && status !== "CANCELLED"

  return (
    <div className="space-y-4">
      {msg?.error && (
        <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          <Icons.AlertCircle className="h-4 w-4 shrink-0" />
          {msg.error}
        </p>
      )}
      {msg?.ok && msg.message && (
        <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <Icons.CheckCircle2 className="h-4 w-4 shrink-0" />
          {msg.message}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {canConfirm && (
          <Btn tone="primary" icon="CheckCircle2" onClick={() => setPanel(panel === "confirm" ? null : "confirm")}>
            Confirmar pago {paymentMethod ? `(${paymentMethod === "CASH" ? "efectivo" : "Mercado Pago"})` : ""}
          </Btn>
        )}
        {isReview && (
          <Btn tone="primary" icon="Calculator" onClick={() => setPanel(panel === "review" ? null : "review")}>
            Definir tarifa
          </Btn>
        )}
        {canRecalc && (
          <Btn tone="muted" icon="RefreshCw" onClick={() => run(() => recalculateInvoice({ invoiceId }))} disabled={pending}>
            Recalcular
          </Btn>
        )}
        {canCancel && (
          <Btn tone="danger" icon="XCircle" onClick={() => setPanel(panel === "cancel" ? null : "cancel")}>
            Cancelar
          </Btn>
        )}
        {canReopen && (
          <Btn tone="muted" icon="RotateCcw" onClick={() => run(() => reopenInvoice({ invoiceId }))} disabled={pending}>
            Reabrir
          </Btn>
        )}
        <Btn tone="muted" icon="StickyNote" onClick={() => setPanel(panel === "note" ? null : "note")}>
          Agregar nota
        </Btn>
      </div>

      {panel === "confirm" && (
        <FormBox title="Confirmar pago manual">
          <Field label="Referencia (opcional)" value={reference} onChange={setReference} placeholder="N.º de comprobante" />
          <Field label="Nota interna (opcional)" value={notes} onChange={setNotes} placeholder="Detalle de la verificación" />
          <SubmitRow
            pending={pending}
            label="Confirmar pago"
            onSubmit={() => run(() => confirmManualPayment({ invoiceId, reference: reference || undefined, notes: notes || undefined }))}
          />
        </FormBox>
      )}

      {panel === "review" && (
        <FormBox title="Definir tarifa (envío > 20 kg)">
          <p className="text-xs text-muted-foreground">
            Peso facturable: <strong>{Number(billableWeightKg ?? 0).toFixed(2)} kg</strong>. El total se calcula
            automáticamente al aplicar la tarifa.
          </p>
          <Field label="Tarifa por kg (USD)" value={rate} onChange={setRate} placeholder="Ej: 51.00" type="number" />
          {rate && Number(rate) > 0 && billableWeightKg != null && (
            <p className="text-sm text-navy">
              Total estimado:{" "}
              <strong>USD {(Number(billableWeightKg) * Number(rate)).toFixed(2)}</strong>
            </p>
          )}
          <SubmitRow
            pending={pending}
            label="Aplicar tarifa"
            disabled={!rate || Number(rate) <= 0}
            onSubmit={() => run(() => resolveReviewInvoice({ invoiceId, ratePerKg: Number(rate) }))}
          />
        </FormBox>
      )}

      {panel === "cancel" && (
        <FormBox title="Cancelar factura">
          <Field label="Motivo (opcional)" value={reason} onChange={setReason} placeholder="Motivo de la cancelación" />
          <SubmitRow
            pending={pending}
            tone="danger"
            label="Confirmar cancelación"
            onSubmit={() => run(() => cancelInvoice({ invoiceId, reason: reason || undefined }))}
          />
        </FormBox>
      )}

      {panel === "note" && (
        <FormBox title="Nota interna">
          <Field label="Nota" value={note} onChange={setNote} placeholder="Escribí una nota…" />
          <SubmitRow
            pending={pending}
            label="Guardar nota"
            disabled={!note.trim()}
            onSubmit={() => run(() => addInvoiceNote({ invoiceId, note }))}
          />
        </FormBox>
      )}
    </div>
  )
}

function Btn({
  children,
  icon,
  tone,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  icon: keyof typeof Icons
  tone: "primary" | "muted" | "danger"
  onClick: () => void
  disabled?: boolean
}) {
  const Icon = Icons[icon] as React.ComponentType<{ className?: string }>
  const tones = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    muted: "bg-muted text-navy hover:bg-border",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${tones[tone]}`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  )
}

function FormBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-sm font-semibold text-navy">{title}</p>
      {children}
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
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        step={type === "number" ? "0.01" : undefined}
        min={type === "number" ? "0" : undefined}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  )
}

function SubmitRow({
  onSubmit,
  label,
  pending,
  disabled,
  tone = "primary",
}: {
  onSubmit: () => void
  label: string
  pending: boolean
  disabled?: boolean
  tone?: "primary" | "danger"
}) {
  return (
    <button
      type="button"
      onClick={onSubmit}
      disabled={pending || disabled}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 ${
        tone === "danger" ? "bg-red-600" : "bg-primary"
      }`}
    >
      {pending && <Icons.Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </button>
  )
}
