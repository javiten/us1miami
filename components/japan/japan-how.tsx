"use client"

import { useI18n } from "@/components/language-provider"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { JAPAN_HOW_ANCHOR, JAPAN_STEP_IDS } from "@/lib/japan"

/**
 * The six steps of an assisted Japanese purchase.
 *
 * A genuine sequence, so it is an <ol> and the order is carried by the list
 * itself — which leaves the large numerals free to be decorative, as on the
 * other verticals. Step 3 ("you approve the total") is the commercial promise of
 * the page: nothing is bought before the customer confirms the cost, so that row
 * is marked and pulled out of the faint numeral treatment.
 */
export function JapanHow() {
  const { t } = useI18n()
  const h = t.japan.how

  return (
    <section id={JAPAN_HOW_ANCHOR} className="bg-muted py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={h.eyebrow} title={h.title} accent="japan" />

        <ol className="mt-14 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {JAPAN_STEP_IDS.map((id, i) => {
            const step = h.steps[id]
            // Step 3 is the approval gate the page is selling. It gets the solid
            // crimson numeral so the eye lands on it while scanning the rail.
            const isApproval = i === 2

            return (
              <Reveal
                key={id}
                as="li"
                delay={Math.min(i, 5) * 0.05}
                className="relative flex min-w-0 flex-col border-t border-navy/10 pt-6 pb-8"
              >
                <span
                  aria-hidden
                  className={
                    isApproval
                      ? "absolute -top-px left-0 h-px w-16 bg-japan-red"
                      : "absolute -top-px left-0 h-px w-10 bg-japan-red/40"
                  }
                />
                {/* Decorative: the <ol> already conveys the position. */}
                <span
                  aria-hidden
                  className={`font-display text-5xl leading-none tabular-nums ${
                    isApproval ? "text-japan-red" : "text-navy/25"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{step.desc}</p>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
