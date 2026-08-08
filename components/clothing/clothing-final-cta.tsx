"use client"

import { VerticalFinalCta } from "@/components/verticals/vertical-final-cta"
import { useI18n } from "@/components/language-provider"
import { CLOTHING_PRICING_ANCHOR } from "@/lib/clothing"
import { track } from "@/lib/analytics"

export function ClothingFinalCta() {
  const { t } = useI18n()
  const f = t.clothing.finalCta

  return (
    <VerticalFinalCta
      title={f.title}
      body={f.body}
      primary={{
        href: "/registro",
        label: f.ctaPrimary,
        onSelect: () => track("clothing_final_cta_click", { cta: "create_address" }),
      }}
      secondary={{
        href: `#${CLOTHING_PRICING_ANCHOR}`,
        label: f.ctaSecondary,
        onSelect: () => track("clothing_final_cta_click", { cta: "quote" }),
      }}
    />
  )
}
