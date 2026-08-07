"use client"

import { useState } from "react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { CONTAINER, Eyebrow, Headline, Lede } from "@/components/editorial/primitives"
import { cn } from "@/lib/utils"

const stores = [
  "Amazon",
  "eBay",
  "AliExpress",
  "Alibaba",
  "Rakuten",
  "Yahoo! Japan",
  "B&H",
  "Best Buy",
  "Newegg",
  "Apple",
  "Nike",
  "Adidas",
  "Temu",
]

/**
 * Slot 2 — store marquee.
 *
 * Restyled, not restructured. Two changes matter:
 *
 * 1. The store names were white cards with borders and shadows, which made the
 *    very first thing after the hero look like the card grids further down.
 *    They are now plain wordmarks on a hairline band.
 * 2. The animation moved from a Motion `animate` loop to the existing
 *    `.us1-marquee-track` CSS keyframes already used by BrandMarquee. That
 *    gives us pause-on-hover/focus and `prefers-reduced-motion` support for
 *    free, and animates on the compositor instead of per-frame in JS.
 *
 * Only the first copy of the list is exposed to assistive tech; the duplicate
 * that makes the -50% loop seamless is aria-hidden.
 */
function Marquee({ reverse = false, durationSeconds = 64 }: { reverse?: boolean; durationSeconds?: number }) {
  const [paused, setPaused] = useState(false)

  const items = (
    <>
      {stores.map((s) => (
        <span
          key={s}
          className="shrink-0 whitespace-nowrap px-6 text-lg font-semibold tracking-tight text-navy/45 transition-colors duration-300 hover:text-primary sm:px-9 sm:text-xl"
        >
          {s}
        </span>
      ))}
    </>
  )

  return (
    <div
      className="group relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-32" />

      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className={cn("us1-marquee-track flex w-max items-center py-4")}
          data-paused={paused || undefined}
          data-direction={reverse ? "reverse" : undefined}
          style={{ ["--marquee-duration" as string]: `${durationSeconds}s` }}
        >
          {items}
          <div className="flex items-center" aria-hidden="true">
            {items}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Destinations() {
  const { t } = useI18n()

  return (
    <section aria-labelledby="destinations-title" className="py-20 md:py-24">
      <div className={CONTAINER}>
        <Reveal className="max-w-2xl">
          <Eyebrow>{t.destinations.eyebrow}</Eyebrow>
          <Headline id="destinations-title" size="md" className="mt-4">
            {t.destinations.title}
          </Headline>
          <Lede className="mt-5">{t.destinations.subtitle}</Lede>
        </Reveal>
      </div>

      <div className="mt-12 flex flex-col divide-y divide-border border-y border-border">
        <Marquee />
        <Marquee reverse durationSeconds={78} />
      </div>
    </section>
  )
}
