import { notFound } from "next/navigation"
import { requirePermission } from "@/lib/session"
import { getMcByNumber } from "@/lib/queries/admin"
import { mcStatusLabel } from "@/lib/constants"
import { ManifestPrint } from "@/components/admin/manifest-print"

export const metadata = { title: "Manifiesto de carga — US1 Miami", robots: { index: false } }

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

export default async function ManifestPage({ params }: { params: Promise<{ mcId: string }> }) {
  await requirePermission("manifests.manage")
  const { mcId } = await params
  const mcNumber = decodeURIComponent(mcId)

  const row = await getMcByNumber(mcNumber)
  if (!row) notFound()

  const { mc, cwrs, looseWr } = row

  const rows = [
    ...cwrs.map((c) => ({
      type: "CWR" as const,
      code: c.cwr.cwrNumber ?? `#${c.cwr.id}`,
      customer: c.customerName ?? DASH,
      box: c.boxNumber ?? DASH,
      pieces: c.cwr.pieces ?? c.cwr.packageIds.length,
      weight: c.cwr.weightLb ? `${c.cwr.weightLb} lb` : DASH,
    })),
    ...looseWr.map((w) => ({
      type: "WR" as const,
      code: w.wrNumber ?? `#${w.id}`,
      customer: w.customerName ?? DASH,
      box: w.boxNumber ?? DASH,
      pieces: 1,
      weight: DASH,
    })),
  ]

  return (
    <ManifestPrint
      mcNumber={mc.mcNumber ?? mcNumber}
      mawbNumber={mc.mawbNumber ?? DASH}
      status={mcStatusLabel(mc.status)}
      destination={mc.destination ?? DASH}
      service={mc.service ?? DASH}
      seal={mc.sealNumber ?? DASH}
      totalWeight={mc.weightLb ? `${mc.weightLb} lb` : DASH}
      totalPieces={mc.pieces ?? rows.reduce((s, r) => s + r.pieces, 0)}
      customerCount={mc.customerCount ?? cwrs.length + looseWr.length}
      createdAt={dateFmt.format(mc.completedAt ?? mc.createdAt)}
      operator={mc.operatorName?.replace(/\s*\([^)]*\)\s*$/, "").trim() ?? DASH}
      rows={rows}
    />
  )
}
