"use client"

import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { Eyebrow, Headline, Section } from "@/components/editorial/primitives"

/**
 * Slot 4 — the numbered process.
 *
 * Replaces a 6-up grid of bordered cards with a numbered editorial timeline:
 * a single hairline rail runs through the steps, and the display-serif numeral
 * is the signature element rather than an icon in a rounded square. The icons
 * were removed on purpose — with six steps they added colour and noise without
 * adding information the number and title do not already carry.
 *
 * The rail is horizontal from `md` up and vertical on mobile, so the reading
 * order and the visual order always agree.
 */
export function HowItWorks() {
  const { t } = useI18n()
  const steps = t.how.steps

  return (
    <Section id="how-it-works" tone="muted" space="normal" aria-labelledby="how-it-works-title">
      <Reveal className="max-w-2xl">
        <Eyebrow>{t.how.eyebrow}</Eyebrow>
        <Headline id="how-it-works-title" size="lg" className="mt-4">
          {t.how.title}
        </Headline>
      </Reveal>

      <ol className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal
            key={s.title}
            as="li"
            delay={i * 0.05}
            className="relative flex min-w-0 flex-col border-t border-navy/15 pt-6"
          >
            {/* The numeral sits on the rail, breaking the hairline. */}
            <span aria-hidden className="absolute -top-px left-0 h-px w-10 bg-primary" />
            <span className="font-display text-5xl leading-none text-navy/25 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-5 text-lg font-semibold text-navy">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{s.desc}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
