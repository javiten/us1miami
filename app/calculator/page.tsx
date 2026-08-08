import type { Metadata } from "next"
import { CalculatorShell } from "@/components/calculator/calculator-shell"
import { buildCalculatorJsonLd, buildCalculatorMetadata } from "@/lib/calculator-seo"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://us1miami.com"

export const metadata: Metadata = buildCalculatorMetadata("es", "/calculator")

/**
 * Locale-agnostic entry point. Defaults to Spanish (the primary audience) but
 * leaves `forced` off so the language provider can still honour a stored or
 * detected preference, matching the verticals' root routes.
 */
export default function CalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCalculatorJsonLd("es", siteUrl)) }}
      />
      <CalculatorShell initialLocale="es" />
    </>
  )
}
