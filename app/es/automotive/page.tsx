import type { Metadata } from "next"
import { AutomotiveShell } from "@/components/automotive/automotive-shell"
import { buildAutomotiveJsonLd, buildAutomotiveMetadata } from "@/lib/automotive-seo"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://us1miami.com"

export const metadata: Metadata = buildAutomotiveMetadata("es", "/es/automotive")

export default function AutomotivePageEs() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildAutomotiveJsonLd("es", siteUrl)) }}
      />
      <AutomotiveShell initialLocale="es" forced />
    </>
  )
}
