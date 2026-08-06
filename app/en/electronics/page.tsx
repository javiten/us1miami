import type { Metadata } from "next"
import { ElectronicsShell } from "@/components/electronics/electronics-shell"
import { buildElectronicsJsonLd, buildElectronicsMetadata } from "@/lib/electronics-seo"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://us1miami.com"

export const metadata: Metadata = buildElectronicsMetadata("en", "/en/electronics")

export default function ElectronicsPageEn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildElectronicsJsonLd("en", siteUrl)) }}
      />
      <ElectronicsShell initialLocale="en" forced />
    </>
  )
}
