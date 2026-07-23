import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { requirePermission } from "@/lib/session"
import { getPackageByWrNumber } from "@/lib/queries/admin"
import { buildLabelData, generateBarcodeSvg, generateQrSvg } from "@/lib/label-render"
import { WrLabel } from "@/components/admin/wr-label"

export const metadata = { title: "Etiqueta WR — US1 Miami", robots: { index: false } }

export default async function WrLabelPage({ params }: { params: Promise<{ wrId: string }> }) {
  await requirePermission("warehouse.records")
  const { wrId } = await params
  const wrNumber = decodeURIComponent(wrId)

  const row = await getPackageByWrNumber(wrNumber)
  if (!row) notFound()

  const { pkg } = row
  const customerName =
    row.firstName && row.lastName ? `${row.firstName} ${row.lastName}` : (row.customerName ?? "\u2014")
  const boxNumber = pkg.boxNumber ?? "\u2014"
  const data = buildLabelData(pkg)

  // Build an absolute origin so the QR resolves from any scanner.
  const h = await headers()
  const proto = h.get("x-forwarded-proto") ?? "https"
  const host = h.get("host") ?? ""
  const origin = host ? `${proto}://${host}` : ""
  const qrTarget = `${origin}/admin/wr/${encodeURIComponent(wrNumber)}`

  const barcodeSvg = generateBarcodeSvg(wrNumber)
  const qrSvg = await generateQrSvg(qrTarget)

  return (
    <WrLabel
      wrNumber={wrNumber}
      customerName={customerName}
      boxNumber={boxNumber}
      data={data}
      barcodeSvg={barcodeSvg}
      qrSvg={qrSvg}
      detailHref={`/admin/paquetes/${pkg.id}`}
    />
  )
}
