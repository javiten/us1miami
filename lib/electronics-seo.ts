import type { Metadata } from "next"
import {
  ELECTRONICS_CURRENCY,
  ELECTRONICS_RATE_PER_KG,
  ELECTRONICS_STEP_IDS,
  ELECTRONICS_TRANSIT_DAYS,
} from "@/lib/electronics"
import { electronicsEn, electronicsEs } from "@/lib/i18n-electronics"
import type { Locale } from "@/lib/i18n"

/** Canonical paths for the three electronics entry points. */
export const ELECTRONICS_ALTERNATES = {
  languages: {
    "es-AR": "/es/electronics",
    "en-US": "/en/electronics",
    "x-default": "/electronics",
  },
} as const

const OG_LOCALE = { es: "es_AR", en: "en_US" } as const

export function buildElectronicsMetadata(locale: Locale, canonical: string): Metadata {
  const dict = locale === "es" ? electronicsEs : electronicsEn

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    keywords:
      locale === "es"
        ? [
            "comprar electrónica en Estados Unidos",
            "importar celulares a Argentina",
            "notebooks USA Argentina",
            "courier de electrónica Miami",
            "traer consolas a Argentina",
            "US1 Miami Electronics",
          ]
        : [
            "buy electronics from USA",
            "import phones to Argentina",
            "laptops USA Argentina",
            "electronics courier Miami",
            "ship consoles to Argentina",
            "US1 Miami Electronics",
          ],
    alternates: { canonical, ...ELECTRONICS_ALTERNATES },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: OG_LOCALE[locale],
      type: "website",
      url: canonical,
      images: [{ url: "/images/electronics-hero.png", width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
  }
}

/**
 * Service structured data for the electronics vertical.
 *
 * Unlike clothing, electronics has a single starting rate, so the offer is a
 * plain `Offer` carrying a `minPrice` price specification rather than an
 * `AggregateOffer`. This is what makes the rate machine-readable as a floor —
 * asserting a bare `price` would misrepresent a "from" rate as a final one.
 */
export function buildElectronicsJsonLd(locale: Locale, siteUrl: string) {
  const dict = locale === "es" ? electronicsEs : electronicsEn

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "US1 Miami Electronics",
        serviceType: locale === "es" ? "Envío de electrónica y tecnología" : "Electronics and technology shipping",
        description: dict.meta.description,
        provider: { "@type": "Organization", name: "US1 Miami", url: siteUrl },
        areaServed: [
          { "@type": "Country", name: "Argentina" },
          { "@type": "Country", name: "United States" },
        ],
        offers: {
          "@type": "Offer",
          priceCurrency: ELECTRONICS_CURRENCY,
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: ELECTRONICS_CURRENCY,
            minPrice: ELECTRONICS_RATE_PER_KG,
            unitCode: "KGM",
          },
          description:
            locale === "es"
              ? `Tarifa por kilogramo desde ${ELECTRONICS_CURRENCY} ${ELECTRONICS_RATE_PER_KG}/kg. El precio final depende del peso real o volumétrico, el que sea mayor.`
              : `Per-kilogram rate from ${ELECTRONICS_CURRENCY} ${ELECTRONICS_RATE_PER_KG}/kg. The final price depends on the actual or volumetric weight, whichever is greater.`,
        },
      },
      {
        "@type": "HowTo",
        name: dict.how.title,
        totalTime: `P${ELECTRONICS_TRANSIT_DAYS}D`,
        step: ELECTRONICS_STEP_IDS.map((id, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: dict.how.steps[id].title,
          text: dict.how.steps[id].desc,
        })),
      },
    ],
  }
}
