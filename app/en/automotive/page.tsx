import type { Metadata } from "next"
import { AutomotiveShell } from "@/components/automotive/automotive-shell"
import { buildAutomotiveJsonLd, buildAutomotiveMetadata } from "@/lib/automotive-seo"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://us1miami.com"

export const metadata: Metadata = buildAutomotiveMetadata("en", "/en/automotive")

export default function AutomotivePageEn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildAutomotiveJsonLd("en", siteUrl)) }}
      />
      <AutomotiveShell initialLocale="en" forced />
    </>
  )
}
