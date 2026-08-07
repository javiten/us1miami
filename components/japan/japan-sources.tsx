"use client"

import { Gavel, Store, ShoppingBag, Cpu, ToyBrick, House, BookOpen, Diamond, type LucideIcon } from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { JAPAN_SOURCE_IDS, type JapanSourceId } from "@/lib/japan"

const ICONS: Record<JapanSourceId, LucideIcon> = {
  yahooAuctions: Gavel,
  mercari: ShoppingBag,
  amazonJapan: Store,
  hardOff: Cpu,
  hobbyOff: ToyBrick,
  offHouse: House,
  bookOff: BookOpen,
  surugayaMandarake: Diamond,
}

/**
 * The featured Japanese sourcing platforms.
 *
 * Each card names a platform and what it is good for. Deliberately NOT links:
 * these are places we search on the customer's behalf, and an outbound link
 * would imply an endorsed relationship. The section repeats the non-affiliation
 * disclaimer so the statement travels with the names even if a visitor scrolls
 * past the roller.
 */
export function JapanSources() {
  const { t } = useI18n()
  const s = t.japan.sources

  return (
    // bg-card, not bg-muted/40: the thin marquee band directly above this is
    // also muted/40, so the two ran together as one undifferentiated block with
    // no visible boundary between them.
    <section id="japan-sources" className="border-y border-border bg-card py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} accent="japan" />

        {/* The platform names are the content here, so they lead each row. The
            icons are kept but demoted to a small mark beside the name: they
            distinguish an auction house from a chain of physical stores, which
            is the difference that decides where a given item gets found. */}
        <ul className="mt-14 grid gap-x-12 sm:grid-cols-2">
          {JAPAN_SOURCE_IDS.map((id, i) => {
            const item = s.items[id]
            const Icon = ICONS[id]
            return (
              <Reveal
                key={id}
                as="li"
                delay={Math.min(i, 4) * 0.05}
                className="flex min-w-0 gap-4 border-t border-border py-6"
              >
                <Icon className="mt-1 h-4 w-4 shrink-0 text-japan-red" strokeWidth={2} aria-hidden="true" />
                <div className="min-w-0">
                  <h3 className="font-display text-xl leading-tight text-navy">{item.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-pretty text-muted-foreground">{item.desc}</p>
                </div>
              </Reveal>
            )
          })}
        </ul>

        <Reveal className="mx-auto mt-12 max-w-3xl">
          <p className="text-pretty text-center text-xs leading-relaxed text-muted-foreground">
            {t.japan.marketplaces.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
