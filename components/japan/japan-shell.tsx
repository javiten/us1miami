"use client"

import { LanguageProvider } from "@/components/language-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { JapanHero } from "@/components/japan/japan-hero"
import { JapanMarketplaces } from "@/components/japan/japan-marketplaces"
import { JapanCategories } from "@/components/japan/japan-categories"
import { JapanBrands } from "@/components/japan/japan-brands"
import { JapanSources } from "@/components/japan/japan-sources"
import { JapanHow } from "@/components/japan/japan-how"
import { JapanHandling } from "@/components/japan/japan-handling"
import { JapanAssisted } from "@/components/japan/japan-assisted"
import { JapanConditions } from "@/components/japan/japan-conditions"
import { JapanFinalCta } from "@/components/japan/japan-final-cta"
import type { Locale } from "@/lib/i18n"

/**
 * Client shell for /japan. Mirrors the other vertical shells so the header,
 * footer and locale behaviour stay identical across the site.
 *
 * Section order is deliberate. The two rollers are separated by the category
 * grid rather than stacked, so the page does not open with a tall band of
 * scrolling wordmarks. The conditions section sits immediately before the
 * closing CTA so auction finality and used-condition caveats are read before
 * the conversion ask, matching how /electronics places its handling notices.
 *
 * The handling band follows the process steps because it shows what those steps
 * physically look like. It is also the page's only dark full-bleed section —
 * every other section here is white, muted or card — so it sits between the
 * muted `how` and the white `assisted` for contrast on both edges.
 */
export function JapanShell({
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
          <JapanHero />
          <JapanMarketplaces />
          <JapanCategories />
          <JapanBrands />
          <JapanSources />
          <JapanHow />
          <JapanHandling />
          <JapanAssisted />
          <JapanConditions />
          <JapanFinalCta />
        </main>
        <SiteFooter />
        <FloatingWhatsApp />
      </div>
    </LanguageProvider>
  )
}
