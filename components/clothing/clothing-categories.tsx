"use client"

import { Backpack, Baby, Dumbbell, Footprints, Glasses, Shirt, Snowflake, Tag } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"
import { CLOTHING_CATEGORY_KEYS, type ClothingCategoryKey } from "@/lib/clothing"

const icons: Record<ClothingCategoryKey, typeof Shirt> = {
  clothing: Shirt,
  sneakers: Footprints,
  sportswear: Dumbbell,
  jackets: Snowflake,
  bags: Backpack,
  accessories: Glasses,
  kids: Baby,
  outlet: Tag,
}

export function ClothingCategories() {
  const { t } = useI18n()
  const c = t.clothing.categories

  return (
    <section id="clothing-categories" className="border-y border-border bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CLOTHING_CATEGORY_KEYS.map((key, i) => {
            const item = c.items[key]
            const Icon = icons[key]
            return (
              <Reveal key={key} delay={i * 0.04} className="h-full">
                <div className="h-full rounded-3xl border border-border bg-background p-6 transition-colors hover:border-primary/40">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-navy">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
