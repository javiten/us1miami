"use client"

import { Check, ArrowRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { Eyebrow, Headline, Lede, Section } from "@/components/editorial/primitives"

/**
 * Slot 7 — typographic price statement.
 *
 * The price used to live inside a large rounded card containing a second nested
 * card for the inclusions list — a card inside a card inside a grid of cards.
 * Here the figure itself is the layout: it is set very large in the display
 * serif and the inclusions become a plain hairline-separated list beside it.
 *
 * The figure is intentionally still `$55` from `t.pricing` semantics: the value
 * is presentational text, and the authoritative number stays in the copy deck.
 */
export function Pricing() {
  const { t } = useI18n()

  return (
    <Section id="pricing" tone="muted" space="spacious" aria-labelledby="pricing-title">
      <Reveal className="max-w-2xl">
        <Eyebrow>{t.pricing.eyebrow}</Eyebrow>
        <Headline id="pricing-title" size="lg" className="mt-4">
          {t.pricing.title}
        </Headline>
        <Lede className="mt-5">{t.pricing.subtitle}</Lede>
      </Reveal>

      <div className="mt-16 grid gap-12 border-t border-navy/15 pt-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{t.pricing.startingAt}</p>

          {/* The signature element of the page: one very large numeral. */}
          <p className="mt-4 flex items-start gap-3">
            <span className="font-display text-[5.5rem] leading-[0.85] tracking-[-0.02em] text-navy sm:text-[8rem] lg:text-[10rem]">
              $55
            </span>
            <span className="mt-3 text-base font-medium text-muted-foreground sm:mt-5 sm:text-lg">
              {t.pricing.unit}
            </span>
          </p>

          <p className="mt-8 max-w-md text-base leading-relaxed text-pretty text-muted-foreground">
            {t.pricing.transitLead} <span className="font-semibold text-navy">{t.pricing.transitValue}</span>{" "}
            {t.pricing.transitTail}
          </p>

          <a
            href="#quote"
            className="group mt-10 inline-flex items-center gap-2 rounded-md bg-navy px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-primary"
          >
            {t.pricing.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-sm font-semibold text-navy">{t.pricing.includesTitle}</p>
          <ul className="mt-6 flex flex-col">
            {t.pricing.included.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 border-b border-navy/10 py-4 text-sm leading-relaxed text-muted-foreground last:border-b-0"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                {f}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
