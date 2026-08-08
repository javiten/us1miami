"use client"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"

/**
 * The automotive process, as a numbered editorial rail.
 *
 * Previously a 6-up grid of rounded cards, which was the third consecutive card
 * grid on this page. It now uses the same hairline-and-numeral treatment as the
 * homepage process section, so the two read as one system. This is a genuine
 * sequence, so it is marked up as an <ol> — the ordering is carried by the list
 * itself, which leaves the large numerals free to be purely decorative.
 */
export function AutomotiveHow() {
  const { t } = useI18n()
  const a = t.automotive.how

  return (
    <section id="automotive-how" className="scroll-mt-28 border-t border-border bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={a.eyebrow} title={a.title} />

        <ol className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {a.steps.map((step, i) => (
            <Reveal
              key={step.title}
              as="li"
              delay={i * 0.05}
              className="relative flex min-w-0 flex-col border-t border-navy/15 pt-6"
            >
              {/* The numeral sits on the rail, breaking the hairline. */}
              <span aria-hidden className="absolute -top-px left-0 h-px w-10 bg-primary" />
              {/* aria-hidden because the <ol> already conveys the position, so
                  reading "01" aloud would only duplicate it. Being decorative is
                  also what exempts this deliberately faint wash from the text
                  contrast minimum — the step title carries the real contrast. */}
              <span aria-hidden className="font-display text-5xl leading-none text-navy/25 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{step.desc}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
