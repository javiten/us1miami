import type { Metadata } from "next"
import { AUTOMOTIVE_RATE_PER_KG, ASSISTED_PURCHASE_FEE_PCT } from "@/lib/automotive"
import { automotiveEn, automotiveEs } from "@/lib/i18n-automotive"
import type { Locale } from "@/lib/i18n"

const COPY = {
  es: {
    title: "Repuestos Automotrices USA → Argentina | US1 Miami Automotive",
    description: `Comprá repuestos y accesorios automotrices en Estados Unidos y recibilos en Argentina. Envíos desde USD ${AUTOMOTIVE_RATE_PER_KG}/kg y compra asistida opcional con ${ASSISTED_PURCHASE_FEE_PCT}% de comisión.`,
    ogLocale: "es_AR",
  },
  en: {
    title: "Automotive Parts USA → Argentina | US1 Miami Automotive",
    description: `Buy automotive parts and accessories in the United States and receive them in Argentina. Shipping from USD ${AUTOMOTIVE_RATE_PER_KG}/kg with optional assisted purchasing at a ${ASSISTED_PURCHASE_FEE_PCT}% fee.`,
    ogLocale: "en_US",
  },
} as const

/** Canonical paths for the three automotive entry points. */
export const AUTOMOTIVE_ALTERNATES = {
  languages: {
    "es-AR": "/es/automotive",
    "en-US": "/en/automotive",
    "x-default": "/automotive",
  },
} as const

export function buildAutomotiveMetadata(locale: Locale, canonical: string): Metadata {
  const c = COPY[locale]
  return {
    title: c.title,
    description: c.description,
    keywords:
      locale === "es"
        ? [
            "repuestos automotrices Estados Unidos",
            "importar repuestos a Argentina",
            "autopartes USA Argentina",
            "compra asistida repuestos",
            "courier repuestos Miami",
            "US1 Miami Automotive",
          ]
        : [
            "automotive parts from USA",
            "import car parts to Argentina",
            "auto parts Miami Argentina",
            "assisted parts purchasing",
            "automotive courier Miami",
            "US1 Miami Automotive",
          ],
    alternates: { canonical, ...AUTOMOTIVE_ALTERNATES },
    openGraph: {
      title: c.title,
      description: c.description,
      locale: c.ogLocale,
      type: "website",
      url: canonical,
      images: [{ url: "/automotive-hero.png", width: 1200, height: 630, alt: c.title }],
    },
  }
}

/**
 * Service + FAQPage structured data. The FAQ answers are read from the same
 * dictionary the page renders, so the markup can never drift from the copy.
 */
export function buildAutomotiveJsonLd(locale: Locale, siteUrl: string) {
  const dict = locale === "es" ? automotiveEs : automotiveEn
  const c = COPY[locale]

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "US1 Miami Automotive",
        serviceType: locale === "es" ? "Envío de repuestos automotrices" : "Automotive parts shipping",
        description: c.description,
        provider: {
          "@type": "Organization",
          name: "US1 Miami",
          url: siteUrl,
        },
        areaServed: [
          { "@type": "Country", name: "Argentina" },
          { "@type": "Country", name: "United States" },
        ],
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: AUTOMOTIVE_RATE_PER_KG,
          description:
            locale === "es"
              ? `Tarifa inicial por kilogramo para envíos automotrices elegibles desde Miami a Argentina.`
              : `Starting per-kilogram rate for eligible automotive shipments from Miami to Argentina.`,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: dict.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  }
}
