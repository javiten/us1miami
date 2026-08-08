import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { SHIPPING_RATES } from "@/lib/shipping-rates"

export const metadata: Metadata = {
  title: "US1 Miami — Buy Anywhere, Receive in Argentina",
  // Interpolated rather than typed inline — see the note in app/es/page.tsx.
  description: `US1 Miami is an international courier. Shop from anywhere in the world, ship to our Miami warehouse, and we consolidate and deliver everything to Argentina by air in approximately 7 days. From USD $${SHIPPING_RATES.homepageStartingRate}/kg.`,
  alternates: {
    canonical: "/en",
    languages: {
      "es-AR": "/es",
      "en-US": "/en",
      "x-default": "/en",
    },
  },
  openGraph: {
    title: "US1 Miami — Buy Anywhere, Receive in Argentina",
    description:
      "Shop worldwide, ship to Miami, and we deliver to Argentina in ~7 days. Free receiving, storage and consolidation.",
    locale: "en_US",
    type: "website",
  },
}

export default function Page() {
  return <SiteShell initialLocale="en" forced />
}
