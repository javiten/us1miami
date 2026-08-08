"use client"

import { useI18n } from "@/components/language-provider"
import { VerticalHandlingBand } from "@/components/verticals/vertical-handling-band"

/**
 * Navy band for /japan, between the process steps and the assisted-buying
 * explainer. Every other section on the page sits on white, muted or card, so
 * this is the page's only dark full-bleed moment.
 *
 * The copy restates the Japanese receiving point, in-Japan consolidation and the
 * Japan -> Miami -> Argentina route already stated in the `how` steps and the
 * hero route chip. It adds no new service promise.
 */
export function JapanHandling() {
  const { t } = useI18n()
  const h = t.japan.handling

  return (
    <VerticalHandlingBand
      id="japan-handling-title"
      eyebrow={h.eyebrow}
      title={h.title}
      description={h.description}
      imageSrc="/japan-consolidation.png"
      imageAlt={h.imageAlt}
      points={h.points}
      // The parcels sit on the bench in the lower half of this frame.
      imagePosition="object-[center_65%]"
    />
  )
}
