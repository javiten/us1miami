"use client"

import {
  BatteryWarning,
  Ban,
  Package,
  Scale,
  ShieldQuestion,
  Store,
  type LucideIcon,
} from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"
import { ELECTRONICS_NOTICE_ANCHOR, ELECTRONICS_NOTICE_IDS, type ElectronicsNoticeId } from "@/lib/electronics"

const ICONS: Record<ElectronicsNoticeId, LucideIcon> = {
  batteries: BatteryWarning,
  restrictions: Ban,
  oversized: Package,
  weight: Scale,
  warranty: ShieldQuestion,
  notSeller: Store,
}

/**
 * Pre-purchase disclosures for the electronics vertical.
 *
 * This section is a compliance surface, not decoration: it is where battery
 * review, transport restrictions, volumetric weight, warranty ownership and the
 * "we are not the seller" position are stated. It is also the target of the
 * page's "quote" CTAs, so it carries the shared notice anchor.
 */
export function ElectronicsNotice() {
  const { t } = useI18n()
  const n = t.electronics.notice

  return (
    <section
      id={ELECTRONICS_NOTICE_ANCHOR}
      // scroll-mt keeps the heading clear of the fixed header when the page's
      // "quote" CTAs jump here.
      className="scroll-mt-24 border-y border-border bg-navy py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={n.eyebrow} title={n.title} subtitle={n.subtitle} tone="light" />

        {/* Hairline-divided disclosures rather than six translucent cards on
            navy. The icons stay here — unlike the decorative category glyphs,
            these flag the *kind* of caveat (battery, prohibited, oversized) and
            help someone scanning for the one that applies to their order. */}
        <ul className="mt-14 grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">
          {ELECTRONICS_NOTICE_IDS.map((id, i) => {
            const item = n.items[id]
            const Icon = ICONS[id]
            return (
              <Reveal
                key={id}
                as="li"
                delay={Math.min(i, 3) * 0.06}
                className="flex min-w-0 flex-col border-t border-white/15 py-6"
              >
                <Icon className="h-5 w-5 text-sky" strokeWidth={2} aria-hidden="true" />
                <h3 className="mt-4 text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-white/70">{item.desc}</p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
