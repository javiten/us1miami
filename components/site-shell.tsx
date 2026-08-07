"use client"

import type { Locale } from "@/lib/i18n"
import { LanguageProvider } from "@/components/language-provider"
import { SiteHeader } from "@/components/site-header"
import { HeroCarousel } from "@/components/hero/hero-carousel"
import { Destinations } from "@/components/destinations"
import { HowItWorks } from "@/components/how-it-works"
import { Consolidate } from "@/components/consolidate"
import { Services } from "@/components/services"
import { Pricing } from "@/components/pricing"
import { WarehouseSection } from "@/components/warehouse"
import { RouteSection } from "@/components/route"
import { Proof } from "@/components/proof"
import { Faq } from "@/components/faq"
import { FinalCta } from "@/components/final-cta"
import { SiteFooter } from "@/components/site-footer"

export function SiteShell({ initialLocale, forced = false }: { initialLocale: Locale; forced?: boolean }) {
  return (
    <LanguageProvider initialLocale={initialLocale} forced={forced}>
      <main className="relative min-h-screen overflow-x-hidden">
        <SiteHeader />
        <HeroCarousel />
        {/* Section rhythm is deliberate: each slot has a different shape so no
            two consecutive sections read as the same card grid.
            2 marquee · 3 split · 4 numbered rail · 5 full-bleed photo ·
            6 asymmetric bento · 7 type statement · 8 route · 9 figures ·
            10 FAQ · 11 full-width close. */}
        <Destinations />
        <Consolidate />
        <HowItWorks />
        <WarehouseSection />
        <Services />
        <Pricing />
        <RouteSection />
        <Proof />
        <Faq />
        <FinalCta />
        <SiteFooter />
      </main>
    </LanguageProvider>
  )
}
