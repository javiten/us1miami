import type { Metadata } from "next"
import { calculatorEn, calculatorEs } from "@/lib/i18n-calculator"
import type { Locale } from "@/lib/i18n"

/** Canonical paths for the three calculator entry points. */
export const CALCULATOR_ALTERNATES = {
  languages: {
    "es-AR": "/es/calculator",
    "en-US": "/en/calculator",
    "x-default": "/calculator",
  },
} as const

const OG_LOCALE = { es: "es_AR", en: "en_US" } as const

export function buildCalculatorMetadata(locale: Locale, canonical: string): Metadata {
  const dict = locale === "es" ? calculatorEs : calculatorEn

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    keywords:
      locale === "es"
        ? [
            "calcular envío Miami Argentina",
            "cuánto cuesta traer de Estados Unidos",
            "calculadora de envíos courier",
            "costo por kilo Miami Argentina",
            "US1 Miami calculadora",
          ]
        : [
            "calculate shipping Miami Argentina",
            "shipping cost calculator",
            "cost per kilo Miami Argentina",
            "courier shipping estimate",
            "US1 Miami calculator",
          ],
    alternates: { canonical, ...CALCULATOR_ALTERNATES },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: OG_LOCALE[locale],
      type: "website",
      url: canonical,
      images: [{ url: "/calculator-weighing.png", width: 1200, height: 630, alt: dict.visual.imageAlt }],
    },
  }
}

/**
 * Structured data for /calculator.
 *
 * A `WebApplication` node rather than the `Service` + `HowTo` graph the vertical
 * pages use: this page is a tool, not a service offering, and the services it
 * prices are already described on their own pages.
 *
 * Deliberately carries NO `offers` node. The published per-kilogram rates are
 * starting points that the calculator itself qualifies as estimates subject to
 * volumetric weight and inspection, so emitting a machine-readable price here
 * would harden an estimate into a quoted price.
 */
export function buildCalculatorJsonLd(locale: Locale, siteUrl: string) {
  const dict = locale === "es" ? calculatorEs : calculatorEn

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: dict.hero.title,
    description: dict.meta.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    inLanguage: locale === "es" ? "es-AR" : "en-US",
    provider: { "@type": "Organization", name: "US1 Miami", url: siteUrl },
  }
}
