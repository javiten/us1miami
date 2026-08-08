"use client"

import Image from "next/image"

import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { CONTAINER, Eyebrow, Headline, Lede } from "@/components/editorial/primitives"

/**
 * Full-width navy band for /electronics, sitting between the process steps and
 * the pre-purchase disclosures.
 *
 * Follows the homepage `RouteSection` pattern rather than inventing a new one:
 * navy section, prose block in the container, then a wide cinematic image that
 * breaks the container to the full viewport width. The page was previously an
 * unbroken run of white card grids, so this is the one place it goes dark.
 *
 * The copy is deliberately not a new service promise — logging, weighing by
 * max(actual, volumetric) and protective packing are all already stated in the
 * `how` steps and the notices below.
 */
export function ElectronicsHandling() {
  const { t } = useI18n()
  const h = t.electronics.handling

  return (
    <section aria-labelledby="electronics-handling-title" className="bg-navy py-20 text-white md:py-28">
      <div className={CONTAINER}>
        <Reveal className="max-w-2xl">
          <Eyebrow tone="light">{h.eyebrow}</Eyebrow>
          <Headline id="electronics-handling-title" size="lg" tone="light" className="mt-4">
            {h.title}
          </Headline>
          <Lede tone="light" className="mt-6">
            {h.description}
          </Lede>
        </Reveal>
      </div>

      {/* Cinematic band. Taller aspect on mobile so the subject stays readable
          when the frame is narrow, wide 21:9 from sm up. */}
      <Reveal delay={0.1} className="mt-14">
        <div className="relative aspect-3/2 w-full overflow-hidden sm:aspect-21/9">
          <Image
            src="/electronics-handling.png"
            alt={h.imageAlt}
            fill
            sizes="100vw"
            // The source is wider than tall but still gets cropped hard at 21:9
            // on desktop; anchoring at 60% keeps the bench and carton in frame
            // instead of centring on empty warehouse ceiling.
            className="object-cover object-[center_60%]"
          />
          {/* Fixed navy wash, matching FullBleed's approach: it exists to hold
              contrast over the photograph, not as decoration. */}
          <div aria-hidden className="absolute inset-0 bg-navy/35" />
        </div>
      </Reveal>

      {/* Three facts, as a real list of peer items. Hairline separators rather
          than cards — the page already has enough card grids. */}
      <div className={CONTAINER}>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-white/15 sm:grid-cols-3">
          {h.points.map((point, i) => (
            <Reveal key={point.label} as="li" delay={i * 0.06} className="min-w-0 bg-navy p-6 md:p-8">
              <p className="font-display text-lg leading-snug text-white">{point.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-pretty text-white/65">{point.detail}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
