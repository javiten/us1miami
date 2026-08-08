import type { Metadata } from "next"
import { CalculatorShell } from "@/components/calculator/calculator-shell"
import { buildCalculatorJsonLd, buildCalculatorMetadata } from "@/lib/calculator-seo"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://us1miami.com"

export const metadata: Metadata = buildCalculatorMetadata("en", "/en/calculator")

export default function CalculatorPageEn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCalculatorJsonLd("en", siteUrl)) }}
      />
      <CalculatorShell initialLocale="en" forced />
    </>
  )
}
