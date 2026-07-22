import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"

export const metadata: Metadata = {
  title: "US1 Trade — Buy Anywhere, Receive in Argentina",
  description:
    "US1 Trade is an international courier. Shop from anywhere in the world, ship to our Miami warehouse, and we consolidate and deliver everything to Argentina by air in approximately 7 days. From USD $55/kg.",
  alternates: {
    canonical: "/en",
    languages: {
      "es-AR": "/es",
      "en-US": "/en",
      "x-default": "/en",
    },
  },
  openGraph: {
    title: "US1 Trade — Buy Anywhere, Receive in Argentina",
    description:
      "Shop worldwide, ship to Miami, and we deliver to Argentina in ~7 days. Free receiving, storage and consolidation.",
    locale: "en_US",
    type: "website",
  },
}

export default function Page() {
  return <SiteShell initialLocale="en" forced />
}
