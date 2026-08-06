"use client"

import { BrandMarquee } from "@/components/brand-marquee"
import { useI18n } from "@/components/language-provider"
import { CLOTHING_BRANDS } from "@/lib/brands"

export function ClothingBrands() {
  const { t } = useI18n()
  const b = t.clothing.brands

  return <BrandMarquee label={b.label} brands={CLOTHING_BRANDS} disclaimer={b.disclaimer} durationSeconds={55} />
}
