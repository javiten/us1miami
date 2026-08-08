"use client"

import { CreditCard, Gavel, Info, MapPin, MessagesSquare, Truck, UserRound, type LucideIcon } from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { JAPAN_BARRIER_IDS, JAPAN_REQUEST_ANCHOR, type JapanBarrierId } from "@/lib/japan"

const ICONS: Record<JapanBarrierId, LucideIcon> = {
  japaneseAccount: UserRound,
  localAddress: MapPin,
  paymentMethods: CreditCard,
  sellerComms: MessagesSquare,
  bidding: Gavel,
  domesticShipping: Truck,
}

/**
 * Assisted buying: the barriers that make a Japanese purchase impractical
 * without help, followed by a carefully bounded statement of what we do.
 *
 * The closing note is the legal core of this vertical: it commits to
 * facilitating *eligible* purchases after costs are confirmed, and explicitly
 * declines to promise that any given item can be obtained or won at auction.
 * This section is also the target of the "request a purchase" CTAs, since
 * eligibility is the real question behind that click.
 */
export function JapanAssisted() {
  const { t } = useI18n()
  const a = t.japan.assisted

  return (
    <section id={JAPAN_REQUEST_ANCHOR} className="relative overflow-hidden border-y border-border bg-white py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="us1-japan-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={a.eyebrow} title={a.title} subtitle={a.subtitle} accent="japan" />

        {/* The barriers are the argument for the service, so they read as a list
            of obstacles rather than a grid of product features. Icons name the
            kind of obstacle (account, address, payment) at a glance. */}
        <ul className="mt-14 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {JAPAN_BARRIER_IDS.map((id, i) => {
            const item = a.barriers[id]
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

        {/* The bounded commitment. Kept as a distinct bordered panel — it is the
            legal core of the vertical and must not read as another list item. */}
        <Reveal className="mt-12">
          <div className="flex items-start gap-4 border-l-2 border-japan-red bg-japan-red/[0.04] p-6">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-japan-red" strokeWidth={2.2} aria-hidden="true" />
            <p className="text-pretty text-sm leading-relaxed text-navy">{a.note}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
