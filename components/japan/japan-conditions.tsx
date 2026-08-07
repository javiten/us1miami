"use client"

import { BadgeCheck, Clock, FileText, Gavel, Landmark, ShieldAlert, Wrench, type LucideIcon } from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { JAPAN_CONDITION_IDS, type JapanConditionId } from "@/lib/japan"

const ICONS: Record<JapanConditionId, LucideIcon> = {
  auctionsFinal: Gavel,
  usedWear: Wrench,
  sellerDescription: FileText,
  restricted: ShieldAlert,
  customs: Landmark,
  timing: Clock,
  noWarranty: BadgeCheck,
}

/**
 * The conditions a customer must understand before committing.
 *
 * Placed immediately before the closing CTA so the caveats are read as part of
 * the decision rather than buried mid-page. Auction finality and used-condition
 * wear lead because they cause the most disputes.
 */
export function JapanConditions() {
  const { t } = useI18n()
  const c = t.japan.conditions

  return (
    <section id="japan-conditions" className="border-t border-border bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} accent="japan" />

        {/* Hairline rows rather than seven cards. These are caveats read before
            committing, and the card styling made them look like features being
            advertised. The icons stay because they name the kind of risk
            (auction finality, customs, wear) someone is scanning for. */}
        <ul className="mt-14 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {JAPAN_CONDITION_IDS.map((id, i) => {
            const item = c.items[id]
            const Icon = ICONS[id]
            return (
              <Reveal
                key={id}
                as="li"
                delay={Math.min(i, 5) * 0.04}
                className="flex min-w-0 flex-col border-t border-border py-6"
              >
                <Icon className="h-5 w-5 text-japan-red" strokeWidth={2} aria-hidden="true" />
                <h3 className="mt-4 text-base font-semibold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{item.desc}</p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
