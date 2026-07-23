import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { requirePermission } from "@/lib/session"
import { getCwrByNumber } from "@/lib/queries/admin"
import { generateBarcodeSvg, generateQrSvg } from "@/lib/label-render"
import { CwrLabel } from "@/components/admin/cwr-label"

export const metadata = { title: "Etiqueta CWR — US1 Miami", robots: { index: false } }

const DASH = "\u2014"

const dateFmt = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/New_York",
})

export default async function CwrLabelPage({ params }: { params: Promise<{ cwrId: string }> }) {
  await requirePermission("consolidations.manage")
  const { cwrId } = await params
  const cwrNumber = decodeURIComponent(cwrId)

  const row = await getCwrByNumber(cwrNumber)
  if (!row) notFound()

  const { cwr } = row
  const dims =
    cwr.lengthIn && cwr.widthIn && cwr.heightIn
      ? `${cwr.lengthIn} \u00d7 ${cwr.widthIn} \u00d7 ${cwr.heightIn} in`
      : DASH

  const data = {
    cwrNumber: cwr.cwrNumber ?? cwrNumber,
    customerName: row.customerName ?? DASH,
    boxNumber: row.boxNumber ?? DASH,
    pieces: String(cwr.pieces ?? row.members.length),
    weight: cwr.weightLb ? `${cwr.weightLb} lb` : DASH,
    size: dims,
    content: cwr.description || DASH,
    location: cwr.warehouseLocation || DASH,
    operator: cwr.operatorName?.replace(/\s*\([^)]*\)\s*$/, "").trim() || DASH,
    dateTimeStr: dateFmt.format(cwr.completedAt ?? cwr.createdAt),
    wrList: row.members.map((m) => m.wrNumber ?? `#${m.id}`),
  }

  const h = await headers()
  const proto = h.get("x-forwarded-proto") ?? "https"
  const host = h.get("host") ?? ""
  const origin = host ? `${proto}://${host}` : ""
  const qrTarget = `${origin}/admin/desconsolidar-cwr?cwr=${encodeURIComponent(data.cwrNumber)}`

  const barcodeSvg = generateBarcodeSvg(data.cwrNumber)
  const qrSvg = await generateQrSvg(qrTarget)

  return <CwrLabel cwrNumber={data.cwrNumber} data={data} barcodeSvg={barcodeSvg} qrSvg={qrSvg} />
}
