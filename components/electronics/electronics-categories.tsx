"use client"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"
import { ELECTRONICS_CATEGORY_IDS } from "@/lib/electronics"

/**
 * Electronics categories as a spec sheet.
 *
 * Was a 5-across grid of 10 icon-chip cards, which made this the third card
 * grid in a row and reduced each category to a 12px label under a glyph. The
 * icons were decorative — a laptop outline next to the word "Computers" adds
 * nothing — so they are gone.
 *
 * Shaped as a dense two-column table with monospace index numbers, which reads
 * as a technical parts manifest and suits consumer electronics. That keeps it
 * distinct from /clothing (large serif names, airy) and /automotive (single
 * dense column of short labels): all three are lists, but none of them look
 * like the same list.
 */
export function ElectronicsCategories() {
  const { t } = useI18n()
  const c = t.electronics.categories

  return (
    <section id="electronics-categories" className="border-y border-border bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Intro beside the manifest from lg up, sticky while reading down it.
            Alone it is a max-w-2xl block in a max-w-6xl container, which leaves
            a wide dead column to its right. */}
        <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <SectionHeading
            eyebrow={c.eyebrow}
            title={c.title}
            subtitle={c.subtitle}
            className="lg:sticky lg:top-28 lg:self-start"
          />

          <ul className="grid gap-x-12 sm:grid-cols-2">
            {ELECTRONICS_CATEGORY_IDS.map((id, i) => {
              const item = c.items[id]
              return (
                <Reveal
                  key={id}
                  as="li"
                  delay={Math.min(i, 6) * 0.03}
                  className="flex min-w-0 items-baseline gap-5 border-t border-border py-5"
                >
                  {/* Monospace tabular index: fixed-width digits keep the column
                      edge straight, which is what makes this read as a manifest.
                      aria-hidden because it is a visual ruler, not content. */}
                  <span aria-hidden className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <h3 className="text-base font-semibold text-navy">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-pretty text-muted-foreground">{item.desc}</p>
                  </span>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
