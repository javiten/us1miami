"use client"

import { useState } from "react"
import { Printer, RotateCw, FileDown } from "lucide-react"
import { logLabelPrint } from "@/app/actions/reception-actions"

type CwrLabelData = {
  cwrNumber: string
  customerName: string
  boxNumber: string
  pieces: string
  weight: string
  size: string
  content: string
  location: string
  operator: string
  dateTimeStr: string
  wrList: string[]
}

type Props = {
  cwrNumber: string
  data: CwrLabelData
  barcodeSvg: string
  qrSvg: string
}

/**
 * 4x6 CWR (consolidation) label. Mirrors the WR label print pipeline: renders
 * an on-screen preview and prints via a jsPDF document sized exactly 4x6in so
 * the output is always a true 4x6 label regardless of the browser paper default.
 */
export function CwrLabel({ cwrNumber, data, barcodeSvg, qrSvg }: Props) {
  const [busy, setBusy] = useState(false)

  async function buildPdf() {
    const el = document.getElementById("cwr-print")
    if (!el) return null
    const [h2c, jspdf] = await Promise.all([import("html2canvas-pro"), import("jspdf")])
    const html2canvas = h2c.default
    const canvas = await html2canvas(el, { scale: 3, backgroundColor: "#ffffff" })
    const img = canvas.toDataURL("image/png")
    const pdf = new jspdf.jsPDF({ orientation: "portrait", unit: "in", format: [4, 6] })
    pdf.addImage(img, "PNG", 0, 0, 4, 6)
    return pdf
  }

  async function print(mode: "print" | "reprint") {
    setBusy(true)
    try {
      const pdf = await buildPdf()
      if (!pdf) return
      void logLabelPrint(cwrNumber, mode)
      pdf.autoPrint()
      const url = pdf.output("bloburl")
      const win = window.open(url, "_blank")
      if (!win) pdf.save(`${cwrNumber}.pdf`)
    } finally {
      setBusy(false)
    }
  }

  async function downloadPdf() {
    setBusy(true)
    try {
      const pdf = await buildPdf()
      if (!pdf) return
      pdf.save(`${cwrNumber}.pdf`)
      void logLabelPrint(cwrNumber, "pdf")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* On-screen 4x6 preview (2in = 192px baseline scaled up) */}
      <div
        id="cwr-print"
        className="bg-white text-black"
        style={{ width: "384px", height: "576px", padding: "16px", fontFamily: "Arial, sans-serif" }}
      >
        <div className="flex items-center justify-between border-b-2 border-black pb-1.5">
          <div className="text-[11px] font-bold tracking-tight">US1 MIAMI</div>
          <div className="text-[10px] font-semibold">CONSOLIDADO</div>
        </div>

        <div className="mt-2 flex items-end justify-between">
          <div className="text-2xl font-extrabold leading-none">{data.cwrNumber}</div>
          <div className="text-right text-[9px] leading-tight">
            <div className="font-semibold">{data.dateTimeStr}</div>
          </div>
        </div>

        <div className="mt-2 border-y border-black py-1">
          <div className="text-[8px] font-bold uppercase text-neutral-500">Cliente</div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">{data.customerName}</div>
            <div className="text-xs font-semibold">{data.boxNumber}</div>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[9px]">
          <Field label="Piezas" value={data.pieces} />
          <Field label="Peso" value={data.weight} />
          <Field label="Medidas" value={data.size} />
          <Field label="Ubicación" value={data.location} />
          <Field label="Operador" value={data.operator} />
          <Field label="WR incluidos" value={`${data.wrList.length}`} />
        </div>

        {data.content !== "\u2014" && (
          <div className="mt-1.5 text-[9px]">
            <span className="font-bold uppercase text-neutral-500">Contenido: </span>
            {data.content}
          </div>
        )}

        <div className="mt-1.5 max-h-[70px] overflow-hidden text-[8px] leading-tight">
          <span className="font-bold uppercase text-neutral-500">WR: </span>
          {data.wrList.join(", ")}
        </div>

        <div className="mt-2 flex items-end justify-between gap-2">
          <div
            className="flex-1 [&_svg]:h-[52px] [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: barcodeSvg }}
          />
          <div className="h-[64px] w-[64px] [&_svg]:h-full [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: qrSvg }} />
        </div>
        <div className="text-center text-[10px] font-bold tracking-widest">{data.cwrNumber}</div>
      </div>

      <div className="grid w-full max-w-sm grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => print("print")}
          disabled={busy}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          <Printer className="h-4 w-4" /> Imprimir
        </button>
        <button
          type="button"
          onClick={() => print("reprint")}
          disabled={busy}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          <RotateCw className="h-4 w-4" /> Reimprimir
        </button>
        <button
          type="button"
          onClick={downloadPdf}
          disabled={busy}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          <FileDown className="h-4 w-4" /> PDF
        </button>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[8px] font-bold uppercase text-neutral-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  )
}
