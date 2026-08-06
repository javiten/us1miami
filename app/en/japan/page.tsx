import type { Metadata } from "next"
import { JapanShell } from "@/components/japan/japan-shell"
import { buildJapanJsonLd, buildJapanMetadata } from "@/lib/japan-seo"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://us1miami.com"

export const metadata: Metadata = buildJapanMetadata("en", "/en/japan")

export default function JapanPageEn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJapanJsonLd("en", siteUrl)) }}
      />
      <JapanShell initialLocale="en" forced />
    </>
  )
}
