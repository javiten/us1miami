import type { Metadata } from "next"
import { ElectronicsShell } from "@/components/electronics/electronics-shell"
import { buildElectronicsJsonLd, buildElectronicsMetadata } from "@/lib/electronics-seo"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://us1miami.com"

export const metadata: Metadata = buildElectronicsMetadata("es", "/es/electronics")

export default function ElectronicsPageEs() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildElectronicsJsonLd("es", siteUrl)) }}
      />
      <ElectronicsShell initialLocale="es" forced />
    </>
  )
}
