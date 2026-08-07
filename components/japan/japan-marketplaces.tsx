"use client"

import { BrandMarquee } from "@/components/brand-marquee"
import { useI18n } from "@/components/language-provider"
import { JAPAN_MARKETPLACES } from "@/lib/brands"

/**
 * Primary roller: the Japanese marketplaces, auction sites and second-hand
 * chains we can search on a customer's behalf.
 *
 * This is the larger of the two rollers and scrolls slowly, because the names
 * are long and are the substance of the offer. `BrandMarquee` handles the
 * seamless loop, hover/focus pause and `prefers-reduced-motion` fallback.
 */
export function JapanMarketplaces() {
  const { t } = useI18n()
  const m = t.japan.marketplaces

  return <BrandMarquee label={m.label} brands={JAPAN_MARKETPLACES} disclaimer={m.disclaimer} durationSeconds={70} />
}
