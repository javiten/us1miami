"use client"

import { useI18n } from "@/components/language-provider"
import { VerticalHandlingBand } from "@/components/verticals/vertical-handling-band"

/**
 * Navy band for /electronics, between the process steps and the pre-purchase
 * disclosures. The page was otherwise an unbroken run of white card grids, so
 * this is the one place it goes dark.
 *
 * The copy is deliberately not a new service promise — logging, weighing by
 * max(actual, volumetric) and protective packing are already stated in the
 * `how` steps and the notices below.
 */
export function ElectronicsHandling() {
  const { t } = useI18n()
  const h = t.electronics.handling

  return (
    <VerticalHandlingBand
      id="electronics-handling-title"
      eyebrow={h.eyebrow}
      title={h.title}
      description={h.description}
      imageSrc="/electronics-handling.png"
      imageAlt={h.imageAlt}
      points={h.points}
    />
  )
}
