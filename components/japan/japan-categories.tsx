"use client"

import { useI18n } from "@/components/language-provider"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { JAPAN_CATEGORY_IDS } from "@/lib/japan"

/**
 * What we source from Japan.
 *
 * Previously a 4-across grid of 12 icon-chip cards. The glyphs were doing the
 * work the names should do — a gamepad beside "Retro consoles", a camera beside
 * "Cameras" — and at 12px the descriptions were barely legible. This is now a
 * three-column index with the category name carrying each row, which suits a
 * collector's catalogue and keeps the crimson rule as the only ornament.
 */
export function JapanCategories() {
  const { t } = useI18n()
  const c = t.japan.categories

  return (
    <section id="japan-categories" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} accent="japan" />

        <ul className="mt-14 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {JAPAN_CATEGORY_IDS.map((id, i) => {
            const item = c.items[id]
            return (
              <Reveal
                key={id}
                as="li"
                delay={Math.min(i, 5) * 0.04}
                className="flex min-w-0 flex-col border-t border-japan-red/25 py-6"
              >
                <h3 className="font-display text-xl leading-tight text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{item.desc}</p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
