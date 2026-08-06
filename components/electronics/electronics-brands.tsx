"use client"

import { BrandMarquee } from "@/components/brand-marquee"
import { useI18n } from "@/components/language-provider"
import { ELECTRONICS_BRANDS } from "@/lib/brands"

export function ElectronicsBrands() {
  const { t } = useI18n()
  const b = t.electronics.brands

  return <BrandMarquee label={b.label} brands={ELECTRONICS_BRANDS} disclaimer={b.disclaimer} durationSeconds={55} />
}
