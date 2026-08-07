"use client"

import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { Eyebrow, Headline, Section, Stat } from "@/components/editorial/primitives"

/**
 * Slot 9 — factual proof.
 *
 * This slot is where a marketing page would normally put testimonials or a star
 * rating. We have no real customer quotes, and inventing them would be both a
 * trust problem and an advertising-compliance problem, so the section is built
 * from figures the site already publishes: air transit time, starting per-kilo
 * price, the zero-cost intake services, and the number of verticals.
 *
 * If real testimonials arrive later, they belong here — additive, not a
 * replacement for the numbers.
 */
export function Proof() {
  const { t } = useI18n()

  return (
    <Section tone="default" space="normal" aria-labelledby="proof-title">
      <Reveal className="max-w-2xl">
        <Eyebrow>{t.proof.eyebrow}</Eyebrow>
        <Headline id="proof-title" size="lg" className="mt-4">
          {t.proof.title}
        </Headline>
      </Reveal>

      {/* A plain grid rather than a <dl>: the visible label already reads as the
          term for the figure, so wrapping it in dt/dd only made screen readers
          announce the same sentence twice. */}
      <div className="mt-14 grid gap-x-8 gap-y-10 border-t border-navy/15 pt-12 sm:grid-cols-2 lg:grid-cols-4">
        {t.proof.stats.map((s, i) => (
          <Reveal key={s.value} delay={i * 0.06} className="min-w-0">
            <Stat tone="dark" value={s.value} label={s.label} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
