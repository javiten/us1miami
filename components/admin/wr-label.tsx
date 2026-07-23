"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Box,
  CalendarClock,
  Download,
  FileText,
  Layers3,
  MapPin,
  Package,
  Printer,
  RotateCw,
  ScanLine,
  User,
  Weight,
} from "lucide-react"
import { logLabelPrint } from "@/app/actions/reception-actions"
import type { LabelData } from "@/lib/label-render"

const INK = "#0B0F19"
const BLUE = "#1D4ED8"

type Props = {
  wrNumber: string
  customerName: string
  boxNumber: string
  data: LabelData
  barcodeSvg: string
  qrSvg: string
  detailHref: string
}

export function WrLabel({ wrNumber, customerName, boxNumber, data, barcodeSvg, qrSvg, detailHref }: Props) {
  const [busy, setBusy] = useState(false)

  function print(mode: "print" | "reprint") {
    void logLabelPrint(wrNumber, mode)
    window.print()
  }

  async function downloadPdf() {
    const el = document.getElementById("wr-print")
    if (!el) return
    setBusy(true)
    try {
      const [h2c, jspdf] = await Promise.all([import("html2canvas-pro"), import("jspdf")])
      const html2canvas = h2c.default
      const canvas = await html2canvas(el, { scale: 3, backgroundColor: "#ffffff" })
      const img = canvas.toDataURL("image/png")
      const pdf = new jspdf.jsPDF({ orientation: "portrait", unit: "in", format: [4, 6] })
      pdf.addImage(img, "PNG", 0, 0, 4, 6)
      pdf.save(`${wrNumber}.pdf`)
      void logLabelPrint(wrNumber, "pdf")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <style
        dangerouslySetInnerHTML={{
          __html: `
@media print {
  @page { size: 4in 6in; margin: 0; }
  html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; width: 4in; height: 6in; }
  body * { visibility: hidden !important; }
  #wr-print, #wr-print * { visibility: visible !important; }
  #wr-print {
    position: fixed !important;
    left: 0; top: 0;
    margin: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    page-break-after: avoid;
  }
  .no-print { display: none !important; }
}
`,
        }}
      />

      <div className="mx-auto max-w-md">
        {/* Controls — screen only */}
        <div className="no-print mb-6 flex flex-col gap-3">
          <Link
            href={detailHref}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al paquete
          </Link>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => print("print")}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <Printer className="h-4 w-4" /> Imprimir
            </button>
            <button
              type="button"
              onClick={() => print("reprint")}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <RotateCw className="h-4 w-4" /> Reimprimir
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={busy}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> {busy ? "PDF..." : "PDF"}
            </button>
            <Link
              href={detailHref}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <FileText className="h-4 w-4" /> Paquete
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">4 × 6 pulgadas</span>
            <span>10.16 × 15.24 cm</span>
            <span>Escala 100%</span>
            <span>Impresora térmica · 203 dpi</span>
          </div>
        </div>

        {/* Preview surface */}
        <div className="no-print flex justify-center">
          <LabelCard
            wrNumber={wrNumber}
            customerName={customerName}
            boxNumber={boxNumber}
            data={data}
            barcodeSvg={barcodeSvg}
            qrSvg={qrSvg}
            preview
          />
        </div>
      </div>

      {/* Printable label — the only visible element when printing */}
      <div className="pointer-events-none fixed left-[-9999px] top-0 print:pointer-events-auto">
        <LabelCard
          wrNumber={wrNumber}
          customerName={customerName}
          boxNumber={boxNumber}
          data={data}
          barcodeSvg={barcodeSvg}
          qrSvg={qrSvg}
        />
      </div>
    </div>
  )
}

function LabelCard({
  wrNumber,
  customerName,
  boxNumber,
  data,
  barcodeSvg,
  qrSvg,
  preview = false,
}: {
  wrNumber: string
  customerName: string
  boxNumber: string
  data: LabelData
  barcodeSvg: string
  qrSvg: string
  preview?: boolean
}) {
  return (
    <div
      id={preview ? undefined : "wr-print"}
      style={{
        width: "4in",
        height: "6in",
        boxSizing: "border-box",
        padding: "16px",
        background: "#ffffff",
        color: INK,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: preview ? 14 : 0,
        boxShadow: preview ? "0 10px 30px rgba(2,6,23,0.18)" : "none",
        border: preview ? "1px solid #e2e8f0" : "none",
      }}
    >
      {/* 1 — Brand header */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: `2px solid ${INK}`,
          paddingBottom: 8,
          marginBottom: 8,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/us1-miami-logo.png" alt="US1 Miami — Miami a Argentina" style={{ height: 72, width: "auto" }} />
      </div>

      {/* 2 — WR identification */}
      <div style={{ display: "flex", alignItems: "stretch", borderBottom: `2px solid ${INK}`, paddingBottom: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 33, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1 }}>{wrNumber}</span>
        </div>
        <div style={{ width: 112, borderLeft: `2px solid ${INK}`, paddingLeft: 10, marginLeft: 10 }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.7px" }}>
            Fecha / Hora
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{data.dateStr}</div>
          <div style={{ fontSize: 12, fontWeight: 700 }}>{data.timeStr}</div>
        </div>
      </div>

      {/* 3 — Customer and Box */}
      <div style={{ display: "flex", borderBottom: `2px solid ${INK}`, paddingBottom: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, paddingRight: 8, minWidth: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.7px" }}>
            Cliente
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.1, marginTop: 2, wordBreak: "break-word" }}>
            {customerName}
          </div>
        </div>
        <div style={{ width: 126, borderLeft: `2px solid ${INK}`, paddingLeft: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.7px" }}>
            Box
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.1, marginTop: 2 }}>{boxNumber}</div>
        </div>
      </div>

      {/* Optional operational flags */}
      {data.flags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {data.flags.map((f) => (
            <span
              key={f}
              style={{
                border: `1.5px solid ${INK}`,
                borderRadius: 4,
                padding: "2px 7px",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.5px",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      )}

      {/* 4 & 5 — Package + Warehouse info */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, marginBottom: 8 }}>
        <div style={{ flex: 1, paddingRight: 10, minWidth: 0 }}>
          <InfoRow icon={<Package size={14} color={BLUE} />} label="Paquete" value={data.store} />
          <InfoRow icon={<ScanLine size={14} color={BLUE} />} label="Tracking" value={data.tracking} mono />
          <InfoRow icon={<Weight size={14} color={BLUE} />} label="Peso" value={data.weight} />
          <InfoRow icon={<Box size={14} color={BLUE} />} label="Tamaño" value={data.size} />
          <InfoRow icon={<Layers3 size={14} color={BLUE} />} label="Piezas" value={data.pieces} />
          {data.content !== "\u2014" && (
            <InfoRow icon={<FileText size={14} color={BLUE} />} label="Contenido" value={data.content} />
          )}
        </div>
        <div style={{ width: 150, borderLeft: `2px solid ${INK}`, paddingLeft: 12, minWidth: 0 }}>
          <InfoRow icon={<CalendarClock size={14} color={BLUE} />} label="Recibido" value={data.dateTimeStr} />
          <InfoRow icon={<MapPin size={14} color={BLUE} />} label="Ubicación" value={data.location} />
          <InfoRow icon={<User size={14} color={BLUE} />} label="Operador" value={data.operator} />
          <InfoRow icon={<FileText size={14} color={BLUE} />} label="Notas" value={data.notes} />
        </div>
      </div>

      {/* 6 — Barcode + QR */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: `2px solid ${INK}`, paddingTop: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{ width: "100%", height: 52 }}
            dangerouslySetInnerHTML={{ __html: barcodeSvg }}
            className="[&_svg]:block [&_svg]:h-full [&_svg]:w-full"
          />
          <div style={{ textAlign: "center", fontSize: 12, fontWeight: 800, letterSpacing: "2px", marginTop: 4 }}>
            {wrNumber}
          </div>
        </div>
        <div
          style={{ width: 84, height: 84, flexShrink: 0 }}
          dangerouslySetInnerHTML={{ __html: qrSvg }}
          className="[&_svg]:block [&_svg]:h-full [&_svg]:w-full"
        />
      </div>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div style={{ display: "flex", gap: 7, marginBottom: 9, alignItems: "flex-start" }}>
      <div style={{ marginTop: 1, flexShrink: 0 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.6px", lineHeight: 1.2 }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: INK,
            lineHeight: 1.25,
            wordBreak: "break-word",
            fontFamily: mono ? "var(--font-geist-mono, monospace)" : "inherit",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  )
}
