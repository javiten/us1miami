import type { Metadata } from "next"
import {
  CLOTHING_RATE_PER_KG,
  CLOTHING_VOLUME_RATE_PER_KG,
  CLOTHING_VOLUME_MIN_KG,
  CLOTHING_DELIVERY_DAYS,
} from "@/lib/clothing"
import { clothingEn, clothingEs } from "@/lib/i18n-clothing"
import type { Locale } from "@/lib/i18n"

/** Canonical paths for the three clothing entry points. */
export const CLOTHING_ALTERNATES = {
  languages: {
    "es-AR": "/es/clothing",
    "en-US": "/en/clothing",
    "x-default": "/clothing",
  },
} as const

const OG_LOCALE = { es: "es_AR", en: "en_US" } as const

export function buildClothingMetadata(locale: Locale, canonical: string): Metadata {
  const dict = locale === "es" ? clothingEs : clothingEn

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    keywords:
      locale === "es"
        ? [
            "comprar ropa en Estados Unidos",
            "importar ropa a Argentina",
            "zapatillas USA Argentina",
            "courier de ropa Miami",
            "consolidar compras Miami",
            "US1 Miami Clothing",
          ]
        : [
            "buy clothing from USA",
            "import clothes to Argentina",
            "sneakers USA Argentina",
            "clothing courier Miami",
            "consolidate purchases Miami",
            "US1 Miami Clothing",
          ],
    alternates: { canonical, ...CLOTHING_ALTERNATES },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: OG_LOCALE[locale],
      type: "website",
      url: canonical,
      images: [{ url: "/images/clothing-hero.png", width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
  }
}

/**
 * Service structured data with both rate tiers expressed as an
 * AggregateOffer, so the volume rate is machine-readable as a *low* price
 * rather than the only price. The eligibility condition travels with it.
 */
export function buildClothingJsonLd(locale: Locale, siteUrl: string) {
  const dict = locale === "es" ? clothingEs : clothingEn

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "US1 Miami Clothing",
        serviceType: locale === "es" ? "Envío de ropa y calzado" : "Clothing and footwear shipping",
        description: dict.meta.description,
        provider: { "@type": "Organization", name: "US1 Miami", url: siteUrl },
        areaServed: [
          { "@type": "Country", name: "Argentina" },
          { "@type": "Country", name: "United States" },
        ],
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: CLOTHING_VOLUME_RATE_PER_KG,
          highPrice: CLOTHING_RATE_PER_KG,
          offerCount: 2,
          description:
            locale === "es"
              ? `Tarifa por kilogramo. USD ${CLOTHING_RATE_PER_KG}/kg regular y desde USD ${CLOTHING_VOLUME_RATE_PER_KG}/kg en envíos elegibles de ${CLOTHING_VOLUME_MIN_KG} kg o más.`
              : `Per-kilogram rate. USD ${CLOTHING_RATE_PER_KG}/kg regular and from USD ${CLOTHING_VOLUME_RATE_PER_KG}/kg on eligible shipments of ${CLOTHING_VOLUME_MIN_KG} kg or more.`,
        },
      },
      {
        "@type": "HowTo",
        name: dict.how.title,
        totalTime: `P${CLOTHING_DELIVERY_DAYS}D`,
        step: dict.how.steps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.title,
          text: step.desc,
        })),
      },
    ],
  }
}
