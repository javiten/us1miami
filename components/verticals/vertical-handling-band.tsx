"use client"

import Image from "next/image"

import { Reveal } from "@/components/reveal"
import { CONTAINER, Eyebrow, Headline, Lede } from "@/components/editorial/primitives"
import { cn } from "@/lib/utils"

export type HandlingPoint = {
  label: string
  detail: string
}

export type VerticalHandlingBandProps = {
  /** Anchors the section's accessible name to its own headline. */
  id: string
  eyebrow: string
  title: string
  description: string
  /** Public path of the wide photograph that closes the band. */
  imageSrc: string
  imageAlt: string
  points: HandlingPoint[]
  /**
   * `object-position` for the photograph. The band crops to 21:9 on desktop,
   * which is aggressive, so each vertical picks the anchor that keeps its
   * subject in frame. Defaults to slightly below centre.
   */
  imagePosition?: string
  className?: string
}

/**
 * Full-width navy band used by the vertical pages: prose and supporting facts
 * on a navy field, closed by a wide cinematic photograph that breaks the
 * container to the full viewport width.
 *
 * Shared rather than copied per vertical. The four closing CTAs on these pages
 * were independent copies of one design and had already drifted apart in
 * typography, so this starts shared to avoid repeating that.
 *
 * Layout note: the prose column is capped for readability, so a single
 * full-width block leaves an empty right half and pushes the band past 1300px
 * tall. Pairing prose with the facts fills that column and shortens the band.
 */
export function VerticalHandlingBand({
  id,
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  points,
  imagePosition = "object-[center_60%]",
  className,
}: VerticalHandlingBandProps) {
  return (
    <section aria-labelledby={id} className={cn("bg-navy py-20 text-white md:py-28", className)}>
      <div className={CONTAINER}>
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
          <Reveal>
            <Eyebrow tone="light">{eyebrow}</Eyebrow>
            <Headline id={id} size="lg" tone="light" className="mt-4">
              {title}
            </Headline>
            <Lede tone="light" className="mt-6">
              {description}
            </Lede>
          </Reveal>

          {/* A real list of peer items, separated by hairlines rather than boxed
              into cards — these pages are already dense with card grids. */}
          <ul className="lg:pt-2">
            {points.map((point, i) => (
              <Reveal
                key={point.label}
                as="li"
                delay={i * 0.06}
                className="border-t border-white/15 py-5 first:border-t-0 first:pt-0 last:pb-0"
              >
                <p className="font-display text-lg leading-snug text-white">{point.label}</p>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-white/65">{point.detail}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      {/* Taller aspect on mobile so the subject stays readable when the frame is
          narrow; 21:9 from sm up. */}
      <Reveal delay={0.1} className="mt-16">
        <div className="relative aspect-3/2 w-full overflow-hidden sm:aspect-21/9">
          <Image src={imageSrc} alt={imageAlt} fill sizes="100vw" className={cn("object-cover", imagePosition)} />
          {/* Fixed navy wash, matching FullBleed's approach: it holds contrast
              over the photograph, it is not decoration. */}
          <div aria-hidden className="absolute inset-0 bg-navy/35" />
        </div>
      </Reveal>
    </section>
  )
}
