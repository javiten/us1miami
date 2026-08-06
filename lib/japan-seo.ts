import type { Metadata } from "next"
import { JAPAN_STEP_IDS } from "@/lib/japan"
import { japanEn, japanEs } from "@/lib/i18n-japan"
import type { Locale } from "@/lib/i18n"

/** Canonical paths for the three Japan entry points. */
export const JAPAN_ALTERNATES = {
  languages: {
    "es-AR": "/es/japan",
    "en-US": "/en/japan",
    "x-default": "/japan",
  },
} as const

const OG_LOCALE = { es: "es_AR", en: "en_US" } as const

export function buildJapanMetadata(locale: Locale, canonical: string): Metadata {
  const dict = locale === "es" ? japanEs : japanEn

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    keywords:
      locale === "es"
        ? [
            "comprar en Japón desde Argentina",
            "subastas japonesas Yahoo Auctions",
            "importar juegos retro de Japón",
            "coleccionables japoneses Argentina",
            "figuras y peluches de Japón",
            "servicio de compra asistida Japón",
            "US1 Miami Japan",
          ]
        : [
            "buy from Japan to Argentina",
            "Japanese auction proxy service",
            "import retro games from Japan",
            "Japanese collectibles Argentina",
            "figures and plush from Japan",
            "assisted buying service Japan",
            "US1 Miami Japan",
          ],
    alternates: { canonical, ...JAPAN_ALTERNATES },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: OG_LOCALE[locale],
      type: "website",
      url: canonical,
      images: [{ url: "/images/japan-hero.png", width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
  }
}

/**
 * Service structured data for the Japan vertical.
 *
 * Deliberately carries NO `offers` node. The other verticals publish a
 * per-kilogram rate that can be expressed as a machine-readable price floor,
 * but a Japan request is quoted individually, so any price value here — even a
 * `minPrice` — would be an unfounded claim. Omitting the offer is the accurate
 * representation of "custom quote".
 *
 * `HowTo` also omits `totalTime`: the page commits to no transit window because
 * the timeline depends on seller handling and the domestic Japanese leg.
 */
export function buildJapanJsonLd(locale: Locale, siteUrl: string) {
  const dict = locale === "es" ? japanEs : japanEn

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "US1 Miami Japan",
        serviceType:
          locale === "es"
            ? "Compra asistida y envío desde Japón"
            : "Assisted purchasing and shipping from Japan",
        description: dict.meta.description,
        provider: { "@type": "Organization", name: "US1 Miami", url: siteUrl },
        areaServed: [
          { "@type": "Country", name: "Argentina" },
          { "@type": "Country", name: "Japan" },
          { "@type": "Country", name: "United States" },
        ],
      },
      {
        "@type": "HowTo",
        name: dict.how.title,
        step: JAPAN_STEP_IDS.map((id, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: dict.how.steps[id].title,
          text: dict.how.steps[id].desc,
        })),
      },
    ],
  }
}
