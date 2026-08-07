"use client"

import { Building2, ShoppingBag, Store } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"

/**
 * Explains that a US1 Miami address behaves like a domestic address at
 * checkout. Deliberately describes retailer *types* rather than naming
 * specific stores, which keeps the legal posture consistent with the brand
 * marquee's disclaimer.
 */
export function ElectronicsShop() {
  const { t } = useI18n()
  const s = t.electronics.shop

  const icons = [ShoppingBag, Building2, Store]

  return (
    <section id="electronics-shop" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <SectionHeading eyebrow={s.eyebrow} title={s.title} subtitle={s.body} />

          {/* Hairline-divided rows rather than three shadowed cards. The icons
              stay: they distinguish the retailer *types* this section is about
              (marketplace, big-box, boutique), which is the whole point of
              describing types instead of naming stores. */}
          <ul className="flex flex-col">
            {s.points.map((point, i) => {
              const Icon = icons[i] ?? ShoppingBag
              return (
                <Reveal key={point.title} as="li" delay={i * 0.07} className="flex gap-5 border-t border-border py-6">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2} aria-hidden="true" />
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-navy">{point.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-pretty text-muted-foreground">{point.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
