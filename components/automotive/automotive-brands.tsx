"use client"

import { BrandMarquee } from "@/components/brand-marquee"
import { useI18n } from "@/components/language-provider"
import { AUTOMOTIVE_BRANDS } from "@/lib/brands"

/** Brand marquee shown directly below the Automotive hero. */
export function AutomotiveBrands() {
  const { t } = useI18n()
  const a = t.automotive.brands

  return <BrandMarquee label={a.label} brands={AUTOMOTIVE_BRANDS} disclaimer={a.disclaimer} durationSeconds={64} />
}
