"use client"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"
import { ELECTRONICS_STEP_IDS } from "@/lib/electronics"

/**
 * The six fulfilment steps, on the same numbered hairline rail the homepage and
 * the other verticals use, so the process reads identically everywhere.
 *
 * Was six bordered cards each with a filled navy number chip, which made this
 * the fourth consecutive card grid on the page.
 *
 * The sequence is carried by the <ol>, so the large numerals are decorative and
 * marked aria-hidden — otherwise every step would be announced twice.
 */
export function ElectronicsHow() {
  const { t } = useI18n()
  const h = t.electronics.how

  return (
    <section id="electronics-how" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={h.eyebrow} title={h.title} />

        <ol className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {ELECTRONICS_STEP_IDS.map((id, i) => {
            const step = h.steps[id]
            return (
              <Reveal
                key={id}
                as="li"
                delay={Math.min(i, 3) * 0.06}
                className="relative flex min-w-0 flex-col border-t border-navy/15 pt-6"
              >
                <span aria-hidden className="absolute -top-px left-0 h-px w-10 bg-primary" />
                <span aria-hidden className="font-display text-5xl leading-none text-navy/25 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{step.desc}</p>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
