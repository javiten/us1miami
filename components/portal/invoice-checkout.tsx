"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"
import { money } from "@/lib/format"
import {
  payInvoiceWithWallet,
  startInvoiceCardPayment,
  confirmInvoiceCardPayment,
  selectManualPayment,
  type PayState,
} from "@/app/actions/invoice-actions"

type Method = "WALLET" | "CARD" | "CASH" | "MERCADO_PAGO"

const METHODS: { id: Method; label: string; hint: string; icon: keyof typeof Icons }[] = [
  { id: "WALLET", label: "Saldo en billetera", hint: "Pago instantáneo con tu saldo disponible", icon: "Wallet" },
  { id: "CARD", label: "Tarjeta de crédito/débito", hint: "Pago instantáneo y seguro", icon: "CreditCard" },
  { id: "CASH", label: "Efectivo", hint: "Queda en verificación hasta que US1 Miami lo confirme", icon: "Banknote" },
  { id: "MERCADO_PAGO", label: "Mercado Pago", hint: "Queda en verificación hasta que US1 Miami lo confirme", icon: "Smartphone" },
]

export function InvoiceCheckout({
  invoiceId,
  amount,
  walletBalance,
  status,
}: {
  invoiceId: number
  amount: number
  walletBalance: number
  status: string
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<Method | null>(null)
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<PayState | null>(null)

  const alreadyPaid = status === "PAID"
  const inReview = status === "REQUIRES_REVIEW"
  const inManual = status === "PENDING_MANUAL_PAYMENT"
  const insufficient = selected === "WALLET" && walletBalance < amount

  function handlePay() {
    if (!selected) return
    setResult(null)
    startTransition(async () => {
      let res: PayState
      if (selected === "WALLET") {
        res = await payInvoiceWithWallet(invoiceId)
      } else if (selected === "CARD") {
        const started = await startInvoiceCardPayment(invoiceId)
        if (started.error) {
          setResult(started)
          return
        }
        if (started.redirectUrl) {
          window.location.href = started.redirectUrl
          return
        }
        // Simulated confirm-gated card flow in the demo environment.
        res = await confirmInvoiceCardPayment(invoiceId, started.sessionId!)
      } else {
        res = await selectManualPayment(invoiceId, selected)
      }
      setResult(res)
      if (res.ok) router.refresh()
    })
  }

  if (alreadyPaid) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-700">
        <Icons.CheckCircle2 className="h-6 w-6 shrink-0" />
        <div>
          <p className="font-semibold">Envío pagado</p>
          <p className="text-sm text-emerald-600">Tu consolidación ya está habilitada para despacho.</p>
        </div>
      </div>
    )
  }

  if (inReview) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-orange-700">
        <Icons.AlertTriangle className="h-6 w-6 shrink-0" />
        <div>
          <p className="font-semibold">En revisión</p>
          <p className="text-sm text-orange-600">
            Tu envío supera los 20 kg facturables. US1 Miami calculará la tarifa y te habilitará el pago.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {inManual && (
        <div className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sky-700">
          <Icons.Clock className="h-5 w-5 shrink-0" />
          <p className="text-sm">
            Registramos tu método de pago manual. El envío queda en espera hasta que US1 Miami verifique el pago. Podés
            cambiar a un pago instantáneo abajo.
          </p>
        </div>
      )}

      <fieldset className="space-y-3" disabled={pending}>
        <legend className="sr-only">Elegí un método de pago</legend>
        {METHODS.map((m) => {
          const Icon = Icons[m.icon] as React.ComponentType<{ className?: string }>
          const isSel = selected === m.id
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelected(m.id)}
              aria-pressed={isSel}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors",
                isSel ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  isSel ? "bg-primary text-primary-foreground" : "bg-muted text-navy",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-navy">{m.label}</span>
                <span className="block text-xs text-muted-foreground">{m.hint}</span>
                {m.id === "WALLET" && (
                  <span className="mt-0.5 block text-xs font-medium text-primary">
                    Saldo disponible: {money(walletBalance)}
                  </span>
                )}
              </span>
              {isSel && <Icons.CheckCircle2 className="h-5 w-5 text-primary" />}
            </button>
          )
        })}
      </fieldset>

      {insufficient && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <Icons.AlertCircle className="h-4 w-4" />
          Saldo insuficiente. Cargá saldo o elegí otro método.
        </p>
      )}

      {result?.error && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          <Icons.AlertCircle className="h-4 w-4 shrink-0" />
          {result.error}
        </p>
      )}
      {result?.ok && result.message && (
        <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Icons.CheckCircle2 className="h-4 w-4 shrink-0" />
          {result.message}
        </p>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={!selected || pending || insufficient}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? (
          <>
            <Icons.Loader2 className="h-4 w-4 animate-spin" />
            Procesando…
          </>
        ) : selected === "CASH" || selected === "MERCADO_PAGO" ? (
          <>Registrar método de pago</>
        ) : (
          <>Pagar {money(amount)}</>
        )}
      </button>
    </div>
  )
}
