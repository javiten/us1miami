"use client"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"
import { CLOTHING_CATEGORY_KEYS } from "@/lib/clothing"

/**
 * Clothing categories as an editorial index.
 *
 * Was an 8-up grid of icon-chip cards. The icons were doing no work that the
 * category name did not already do — a shirt glyph beside the word "Clothing" is
 * decoration — so they are gone, and the category name now carries the section
 * in the display serif.
 *
 * Deliberately shaped differently from the /automotive parts index, which is a
 * dense two-column list of small numbered labels: this one is a wide two-column
 * rhythm with a large serif name and supporting line, so the two verticals do
 * not read as the same section with different words.
 */
export function ClothingCategories() {
  const { t } = useI18n()
  const c = t.clothing.categories

  return (
    <section id="clothing-categories" className="border-y border-border bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />

        <ul className="mt-16 grid gap-x-16 sm:grid-cols-2">
          {CLOTHING_CATEGORY_KEYS.map((key, i) => {
            const item = c.items[key]
            return (
              <Reveal
                key={key}
                as="li"
                delay={i * 0.04}
                className="flex min-w-0 flex-col border-t border-border py-7"
              >
                <h3 className="font-display text-2xl leading-tight text-navy md:text-3xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{item.desc}</p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
