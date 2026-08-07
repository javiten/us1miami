"use client"

import { LanguageProvider } from "@/components/language-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { ClothingHero } from "@/components/clothing/clothing-hero"
import { ClothingBrands } from "@/components/clothing/clothing-brands"
import { ClothingHow } from "@/components/clothing/clothing-how"
import { ClothingCategories } from "@/components/clothing/clothing-categories"
import { ClothingConsolidate } from "@/components/clothing/clothing-consolidate"
import { ClothingPricing } from "@/components/clothing/clothing-pricing"
import { ClothingFinalCta } from "@/components/clothing/clothing-final-cta"
import type { Locale } from "@/lib/i18n"

/**
 * Client shell for /clothing. Mirrors `SiteShell` and `AutomotiveShell` so the
 * Clothing vertical reuses the same header, footer and locale behaviour.
 */
export function ClothingShell({
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
          <ClothingHero />
          <ClothingBrands />
          <ClothingHow />
          <ClothingCategories />
          <ClothingConsolidate />
          <ClothingPricing />
          <ClothingFinalCta />
        </main>
        <SiteFooter />
        <FloatingWhatsApp />
      </div>
    </LanguageProvider>
  )
}
