"use client"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"

/**
 * The clothing process, on the same numbered hairline rail as the homepage and
 * /automotive. Previously a 5-up grid of rounded cards, which made this the
 * first of three consecutive card grids on the page.
 *
 * Five steps is too many for the 3-column rail used elsewhere, so this runs as
 * a single horizontal band on large screens with the hairline carrying across.
 */
export function ClothingHow() {
  const { t } = useI18n()
  const h = t.clothing.how

  return (
    <section id="clothing-how" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={h.eyebrow} title={h.title} />

        <ol className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
          {h.steps.map((step, i) => (
            <Reveal
              key={step.title}
              as="li"
              delay={i * 0.05}
              className="relative flex min-w-0 flex-col border-t border-navy/15 pt-6"
            >
              <span aria-hidden className="absolute -top-px left-0 h-px w-10 bg-primary" />
              {/* Decorative: the <ol> already conveys the order. */}
              <span aria-hidden className="font-display text-5xl leading-none text-navy/25 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-base font-semibold leading-snug text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{step.desc}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
