import { notFound, redirect } from "next/navigation"
import { requirePermission } from "@/lib/session"
import { getPackageByWrNumber } from "@/lib/queries/admin"

// Resolves the QR-code target (/admin/wr/WR-XXXXX) to the package detail page.
export default async function WrRedirectPage({ params }: { params: Promise<{ wrId: string }> }) {
  await requirePermission("warehouse.records")
  const { wrId } = await params
  const row = await getPackageByWrNumber(decodeURIComponent(wrId))
  if (!row) notFound()
  redirect(`/admin/paquetes/${row.pkg.id}`)
}
