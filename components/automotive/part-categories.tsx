"use client"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"
import { PART_CATEGORY_KEYS } from "@/lib/automotive"

/**
 * What can be sourced, as a parts index rather than a card grid.
 *
 * This was twelve bordered cards, each with a coloured icon chip — the densest
 * of the six consecutive card grids on this page. A parts catalogue is exactly
 * the kind of content that reads better as an index: the twelve icons carried
 * no information the label did not already state, and twelve different glyphs
 * in twelve rounded squares added more colour than meaning.
 *
 * The numerals are an index, not a sequence, so they are deliberately quiet —
 * they give the eye a left edge to track down the column without implying the
 * categories are ordered or ranked.
 */
export function PartCategories() {
  const { t } = useI18n()
  const a = t.automotive.categories

  return (
    <section id="automotive-categories" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={a.eyebrow} title={a.title} />

        {/* A two-column index. `border-t` on every row plus a closing rule on
            the list gives a continuous ruled block without per-item borders. */}
        <ul className="mt-14 grid grid-cols-1 border-b border-border sm:grid-cols-2">
          {PART_CATEGORY_KEYS.map((key, i) => (
            <Reveal
              key={key}
              as="li"
              delay={i * 0.02}
              className="flex items-baseline gap-5 border-t border-border py-5 sm:gap-6"
            >
              <span className="w-6 shrink-0 text-xs font-medium tabular-nums text-muted-foreground/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base font-medium text-navy">{a.items[key]}</span>
            </Reveal>
          ))}
        </ul>

        {/* Eligibility caveat sits directly under the list it qualifies. */}
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">{a.note}</p>
        </Reveal>
      </div>
    </section>
  )
}
