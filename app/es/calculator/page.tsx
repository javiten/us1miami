import type { Metadata } from "next"
import { CalculatorShell } from "@/components/calculator/calculator-shell"
import { buildCalculatorJsonLd, buildCalculatorMetadata } from "@/lib/calculator-seo"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://us1miami.com"

export const metadata: Metadata = buildCalculatorMetadata("es", "/es/calculator")

export default function CalculatorPageEs() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCalculatorJsonLd("es", siteUrl)) }}
      />
      <CalculatorShell initialLocale="es" forced />
    </>
  )
}
