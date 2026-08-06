"use client"

import { LanguageProvider } from "@/components/language-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AutomotiveHero } from "@/components/automotive/automotive-hero"
import { AutomotiveBrands } from "@/components/automotive/automotive-brands"
import { AutomotiveIntro } from "@/components/automotive/automotive-intro"
import { PurchaseOptions } from "@/components/automotive/purchase-options"
import { AutomotiveHow } from "@/components/automotive/automotive-how"
import { PartCategories } from "@/components/automotive/part-categories"
import { SourcingAdvantage } from "@/components/automotive/sourcing-advantage"
import { VinCompatibility } from "@/components/automotive/vin-compatibility"
import { AutomotivePricing } from "@/components/automotive/automotive-pricing"
import { QuoteForm } from "@/components/automotive/quote-form"
import { AutomotiveFaq } from "@/components/automotive/automotive-faq"
import { AutomotiveFinalCta } from "@/components/automotive/automotive-final-cta"
import type { Locale } from "@/lib/i18n"

/**
 * Client shell for /automotive. Mirrors `SiteShell` so the Automotive vertical
 * reuses the exact same header, footer and locale behaviour as the homepage.
 */
export function AutomotiveShell({
  initialLocale,
  forced = false,
}: {
  initialLocale: Locale
  forced?: boolean
}) {
  return (
    <LanguageProvider initialLocale={initialLocale} forced={forced}>
      <div className="relative min-h-screen overflow-x-hidden bg-background">
        <SiteHeader />
        <main>
          <AutomotiveHero />
          <AutomotiveBrands />
          <AutomotiveIntro />
          <PurchaseOptions />
          <AutomotiveHow />
          <PartCategories />
          <SourcingAdvantage />
          <VinCompatibility />
          <AutomotivePricing />
          <QuoteForm />
          <AutomotiveFaq />
          <AutomotiveFinalCta />
        </main>
        <SiteFooter />
      </div>
    </LanguageProvider>
  )
}
