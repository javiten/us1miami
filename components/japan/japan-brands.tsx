"use client"

import { BrandMarquee } from "@/components/brand-marquee"
import { useI18n } from "@/components/language-provider"
import { JAPAN_BRANDS } from "@/lib/brands"

/**
 * Secondary roller: Japanese manufacturers and pop-culture brands.
 *
 * Rendered `compact` and in the opposite direction to the marketplace roller
 * above it, so the two stacked bands stay visually distinct and the brand list
 * clearly reads as supporting detail rather than a second headline.
 */
export function JapanBrands() {
  const { t } = useI18n()
  const b = t.japan.brands

  return (
    <BrandMarquee
      label={b.label}
      brands={JAPAN_BRANDS}
      disclaimer={b.disclaimer}
      durationSeconds={55}
      compact
      reverse
      // The marketplace roller directly above already draws a bottom border.
      className="border-t-0 bg-muted/40"
    />
  )
}
