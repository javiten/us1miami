"use client"

import { LanguageProvider } from "@/components/language-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ElectronicsHero } from "@/components/electronics/electronics-hero"
import { ElectronicsBrands } from "@/components/electronics/electronics-brands"
import { ElectronicsShop } from "@/components/electronics/electronics-shop"
import { ElectronicsCategories } from "@/components/electronics/electronics-categories"
import { ElectronicsHow } from "@/components/electronics/electronics-how"
import { ElectronicsNotice } from "@/components/electronics/electronics-notice"
import { ElectronicsFinalCta } from "@/components/electronics/electronics-final-cta"
import type { Locale } from "@/lib/i18n"

/**
 * Client shell for /electronics. Mirrors `SiteShell`, `AutomotiveShell` and
 * `ClothingShell` so every vertical shares the same header, footer and locale
 * behaviour.
 *
 * Section order is deliberate: the handling notices sit immediately before the
 * closing CTA so the transport caveats are read before the conversion ask, not
 * buried above the fold.
 */
export function ElectronicsShell({
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
          <ElectronicsHero />
          <ElectronicsBrands />
          <ElectronicsShop />
          <ElectronicsCategories />
          <ElectronicsHow />
          <ElectronicsNotice />
          <ElectronicsFinalCta />
        </main>
        <SiteFooter />
      </div>
    </LanguageProvider>
  )
}
