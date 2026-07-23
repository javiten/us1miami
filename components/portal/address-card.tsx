"use client"

import { useState } from "react"
import { Check, Copy, Download, MessageCircle, ShoppingCart } from "lucide-react"
import { MIAMI_ADDRESS, COMPANY } from "@/lib/constants"

function ActionButton({
  onClick,
  href,
  icon: Icon,
  children,
  primary,
}: {
  onClick?: () => void
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  primary?: boolean
}) {
  const cls = primary
    ? "bg-primary text-primary-foreground hover:-translate-y-0.5 shadow-[0_10px_24px_-12px_rgba(15,125,255,0.8)]"
    : "bg-muted text-navy hover:bg-border"
  const base = `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${cls}`
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        <Icon className="h-4 w-4" />
        {children}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={base}>
      <Icon className="h-4 w-4" />
      {children}
    </button>
  )
}

export function AddressCard({ fullName, boxNumber }: { fullName: string; boxNumber: string }) {
  const [copied, setCopied] = useState<"full" | "box" | null>(null)

  const fullAddress = [
    fullName,
    MIAMI_ADDRESS.line1,
    `${MIAMI_ADDRESS.suite} - Box ${boxNumber}`,
    `${MIAMI_ADDRESS.city}, ${MIAMI_ADDRESS.state} ${MIAMI_ADDRESS.zip}`,
    MIAMI_ADDRESS.country,
    `Phone: ${MIAMI_ADDRESS.phone}`,
  ].join("\n")

  async function copy(text: string, which: "full" | "box") {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(which)
      setTimeout(() => setCopied(null), 1800)
    } catch {
      /* ignore */
    }
  }

  function downloadPdf() {
    // Lightweight printable view -> user saves as PDF.
    const w = window.open("", "_blank")
    if (!w) return
    w.document.write(`<html><head><title>Mi direccion US1 Miami - Box ${boxNumber}</title>
      <style>body{font-family:system-ui,sans-serif;padding:48px;color:#071b3a}
      h1{font-size:20px}pre{font-size:16px;line-height:1.7;background:#f8fafc;padding:24px;border-radius:12px;border:1px solid #e4ebf3}</style>
      </head><body><h1>Tu dirección en Miami — ${COMPANY.name}</h1><pre>${fullAddress}</pre>
      <p style="color:#50535a;font-size:13px">Usá esta dirección al comprar en cualquier tienda de Estados Unidos.</p>
      </body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 400)
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Mi dirección en Miami (US1 Miami):\n\n${fullAddress}`)}`

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-navy px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky">Tu dirección en Miami</p>
        <p className="mt-1 text-sm text-white/60">Casillero exclusivo y permanente</p>
      </div>
      <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <pre className="whitespace-pre-wrap rounded-xl border border-border bg-background p-5 font-sans text-[15px] leading-relaxed text-navy">
{fullAddress}
          </pre>
          <div className="mt-4 flex flex-wrap gap-2">
            <ActionButton primary icon={copied === "full" ? Check : Copy} onClick={() => copy(fullAddress, "full")}>
              {copied === "full" ? "¡Copiado!" : "Copiar dirección completa"}
            </ActionButton>
            <ActionButton icon={copied === "box" ? Check : Copy} onClick={() => copy(boxNumber, "box")}>
              {copied === "box" ? "¡Copiado!" : "Copiar número de Box"}
            </ActionButton>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-navy">Cómo usar tu dirección</p>
          <ActionButton icon={ShoppingCart} href="https://www.amazon.com/a/addresses">
            Ver cómo usarla en Amazon
          </ActionButton>
          <ActionButton icon={ShoppingCart} href="https://www.ebay.com/mye/myebay/summary">
            Ver cómo usarla en eBay
          </ActionButton>
          <ActionButton icon={MessageCircle} href={whatsappUrl}>
            Enviar por WhatsApp
          </ActionButton>
          <ActionButton icon={Download} onClick={downloadPdf}>
            Descargar dirección en PDF
          </ActionButton>
        </div>
      </div>
    </div>
  )
}
