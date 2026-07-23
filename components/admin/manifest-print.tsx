"use client"

import { Printer } from "lucide-react"

type Row = {
  type: "CWR" | "WR"
  code: string
  customer: string
  box: string
  pieces: number
  weight: string
}

type Props = {
  mcNumber: string
  mawbNumber: string
  status: string
  destination: string
  service: string
  seal: string
  totalWeight: string
  totalPieces: number
  customerCount: number
  createdAt: string
  operator: string
  rows: Row[]
}

/**
 * Printable cargo manifest for a master consolidation. Uses a letter-size print
 * stylesheet (a manifest is a document, not a 4x6 label) and lists every CWR/WR
 * unit with its owner so customs / the airline have a full itemization.
 */
export function ManifestPrint(props: Props) {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <style>{`@media print { .no-print { display: none !important; } @page { size: letter portrait; margin: 0.5in; } }`}</style>

      <div className="no-print mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          <Printer className="h-4 w-4" /> Imprimir manifiesto
        </button>
      </div>

      <div className="rounded-xl border border-neutral-300 bg-white p-8 text-black">
        <div className="flex items-start justify-between border-b-2 border-black pb-4">
          <div>
            <div className="text-lg font-extrabold">US1 MIAMI</div>
            <div className="text-sm font-semibold text-neutral-600">Manifiesto de carga</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold">{props.mcNumber}</div>
            <div className="text-sm font-semibold">MAWB: {props.mawbNumber}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
          <Info label="Estado" value={props.status} />
          <Info label="Destino" value={props.destination} />
          <Info label="Servicio" value={props.service} />
          <Info label="Precinto" value={props.seal} />
          <Info label="Clientes" value={String(props.customerCount)} />
          <Info label="Piezas totales" value={String(props.totalPieces)} />
          <Info label="Peso total" value={props.totalWeight} />
          <Info label="Fecha" value={props.createdAt} />
        </div>

        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="border-y-2 border-black text-left">
              <th className="py-2 pr-3 font-bold">#</th>
              <th className="py-2 pr-3 font-bold">Tipo</th>
              <th className="py-2 pr-3 font-bold">Código</th>
              <th className="py-2 pr-3 font-bold">Cliente</th>
              <th className="py-2 pr-3 font-bold">Casilla</th>
              <th className="py-2 pr-3 font-bold">Piezas</th>
              <th className="py-2 font-bold">Peso</th>
            </tr>
          </thead>
          <tbody>
            {props.rows.map((r, i) => (
              <tr key={r.code} className="border-b border-neutral-300">
                <td className="py-1.5 pr-3">{i + 1}</td>
                <td className="py-1.5 pr-3">
                  <span className="rounded bg-neutral-200 px-1.5 py-0.5 text-xs font-bold">{r.type}</span>
                </td>
                <td className="py-1.5 pr-3 font-semibold">{r.code}</td>
                <td className="py-1.5 pr-3">{r.customer}</td>
                <td className="py-1.5 pr-3">{r.box}</td>
                <td className="py-1.5 pr-3">{r.pieces}</td>
                <td className="py-1.5">{r.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-10 grid grid-cols-2 gap-8 text-xs">
          <div className="border-t border-black pt-2">Operador: {props.operator}</div>
          <div className="border-t border-black pt-2">Firma / Recibido</div>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase text-neutral-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  )
}
