"use client"

import Image from "next/image"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { CONTAINER, Eyebrow, Headline, Lede } from "@/components/editorial/primitives"

/**
 * Slot 8 — the route.
 *
 * Deliberately *not* a geographic map. Drawing Argentina or a Miami→Buenos
 * Aires arc would mean hand-authoring cartographic paths (inaccurate, and ruled
 * out by our design guidance) or pulling in a full mapping library for a single
 * decorative section. A three-stop route diagram communicates the same thing —
 * origin, transit, destination — with no invented geography.
 *
 * Each stop's copy restates a claim published elsewhere on the site; nothing
 * here asserts a transit time or service level the rest of the page does not.
 */
export function RouteSection() {
  const { t } = useI18n()

  return (
    <section aria-labelledby="route-title" className="bg-navy py-20 text-white md:py-28">
      <div className={CONTAINER}>
        <Reveal className="max-w-2xl">
          <Eyebrow tone="light">{t.route.eyebrow}</Eyebrow>
          <Headline id="route-title" size="lg" tone="light" className="mt-4">
            {t.route.title}
          </Headline>
          <Lede tone="light" className="mt-6">
            {t.route.description}
          </Lede>
        </Reveal>
      </div>

      {/* Wide cinematic band. Short aspect on mobile so it never dominates. */}
      <Reveal delay={0.1} className="mt-14">
        <div className="relative aspect-3/2 w-full overflow-hidden sm:aspect-21/9">
          <Image
            src="/home-air-cargo.png"
            alt={t.route.imageAlt}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div aria-hidden className="absolute inset-0 bg-navy/35" />
        </div>
      </Reveal>

      <div className={CONTAINER}>
        <ol className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-3">
          {t.route.stops.map((stop, i) => (
            // Reveal renders the <li> itself via `as`. Wrapping an <li> inside
            // Reveal's default <div> put a div between the <ol> and its items,
            // which is invalid and breaks the list semantics for screen readers.
            <Reveal
              key={stop.place}
              as="li"
              delay={i * 0.08}
              className="relative min-w-0 border-t border-white/20 pt-6"
            >
              <span aria-hidden className="absolute -top-px left-0 h-px w-10 bg-sky" />
              <p className="font-display text-2xl leading-tight text-white md:text-3xl">{stop.place}</p>
              <p className="mt-3 text-sm font-semibold text-sky">{stop.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-white/65">{stop.detail}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
