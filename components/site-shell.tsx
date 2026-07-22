"use client"

import type { Locale } from "@/lib/i18n"
import { LanguageProvider } from "@/components/language-provider"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Destinations } from "@/components/destinations"
import { HowItWorks } from "@/components/how-it-works"
import { Consolidate } from "@/components/consolidate"
import { Services } from "@/components/services"
import { Pricing } from "@/components/pricing"
import { WarehouseSection } from "@/components/warehouse"
import { Faq } from "@/components/faq"
import { FinalCta } from "@/components/final-cta"
import { SiteFooter } from "@/components/site-footer"

export function SiteShell({ initialLocale, forced = false }: { initialLocale: Locale; forced?: boolean }) {
  return (
    <LanguageProvider initialLocale={initialLocale} forced={forced}>
      <main className="relative min-h-screen overflow-x-hidden">
        <SiteHeader />
        <Hero />
        <Destinations />
        <HowItWorks />
        <Consolidate />
        <Services />
        <Pricing />
        <WarehouseSection />
        <Faq />
        <FinalCta />
        <SiteFooter />
      </main>
    </LanguageProvider>
  )
}
