"use client"

import { LanguageProvider, useI18n } from "@/components/language-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { CalculatorHero } from "@/components/calculator/calculator-hero"
import { ShippingCalculator } from "@/components/calculator/shipping-calculator"
import { VerticalHandlingBand } from "@/components/verticals/vertical-handling-band"
import { VerticalFinalCta } from "@/components/verticals/vertical-final-cta"
import { track } from "@/lib/analytics"
import type { Locale } from "@/lib/i18n"

/**
 * Client shell for /calculator. Mirrors the vertical shells so the header,
 * footer and floating WhatsApp behave identically across the site.
 *
 * Section order is deliberate: the widget sits immediately under the hero
 * because it is the only reason anyone opens this page. Everything below is
 * follow-up — where the number comes from, then the conversion ask — so nothing
 * delays the tool itself.
 */
export function CalculatorShell({ initialLocale, forced = false }: { initialLocale: Locale; forced?: boolean }) {
  return (
    <LanguageProvider initialLocale={initialLocale} forced={forced}>
      <div className="relative min-h-screen overflow-x-hidden bg-background">
        <SiteHeader />
        <main>
          <CalculatorHero />
          <ShippingCalculator />
          <CalculatorVisual />
          <CalculatorFinalCta />
        </main>
        <SiteFooter />
        <FloatingWhatsApp />
      </div>
    </LanguageProvider>
  )
}

/**
 * Reuses the band built for /electronics and /japan. The estimate is
 * weight-based, so showing the weighing step explains where the figure the
 * widget just produced actually comes from.
 */
function CalculatorVisual() {
  const { t } = useI18n()
  const v = t.calculator.visual

  return (
    <VerticalHandlingBand
      id="calculator-visual-title"
      eyebrow={v.eyebrow}
      title={v.title}
      description={v.body}
      imageSrc="/calculator-weighing.png"
      imageAlt={v.imageAlt}
      points={v.points}
    />
  )
}

function CalculatorFinalCta() {
  const { t } = useI18n()
  const f = t.calculator.finalCta

  return (
    <VerticalFinalCta
      title={f.title}
      body={f.body}
      primary={{
        href: "/#quote",
        label: f.primary,
        onSelect: () => track("calculator_quote_cta_click", { cta: "final" }),
      }}
      secondary={{
        href: "/registro",
        label: f.secondary,
        onSelect: () => track("calculator_register_cta_click", { cta: "final" }),
      }}
    />
  )
}
