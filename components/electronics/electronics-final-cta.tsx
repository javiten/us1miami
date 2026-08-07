"use client"

import { VerticalFinalCta } from "@/components/verticals/vertical-final-cta"
import { useI18n } from "@/components/language-provider"
import { ELECTRONICS_NOTICE_ANCHOR } from "@/lib/electronics"
import { track } from "@/lib/analytics"

/**
 * Closing CTA for /electronics. The secondary action points at the handling
 * notices rather than a pricing section, because this vertical has no volume
 * table — the caveats are what a customer needs before asking for a price.
 */
export function ElectronicsFinalCta() {
  const { t } = useI18n()
  const f = t.electronics.finalCta

  return (
    <VerticalFinalCta
      title={f.title}
      body={f.body}
      primary={{
        href: "/registro",
        label: f.ctaPrimary,
        onSelect: () => track("electronics_final_cta_click", { cta: "create_address" }),
      }}
      secondary={{
        href: `#${ELECTRONICS_NOTICE_ANCHOR}`,
        label: f.ctaSecondary,
        onSelect: () => track("electronics_final_cta_click", { cta: "quote" }),
      }}
    />
  )
}
