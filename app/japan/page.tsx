import type { Metadata } from "next"
import { JapanShell } from "@/components/japan/japan-shell"
import { buildJapanJsonLd, buildJapanMetadata } from "@/lib/japan-seo"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://us1miami.com"

export const metadata: Metadata = buildJapanMetadata("es", "/japan")

/**
 * Locale-agnostic entry point. Defaults to Spanish (the primary audience) but
 * leaves `forced` off so the language provider can still honour a stored or
 * detected preference, matching the other verticals' root routes.
 */
export default function JapanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJapanJsonLd("es", siteUrl)) }}
      />
      <JapanShell initialLocale="es" />
    </>
  )
}
