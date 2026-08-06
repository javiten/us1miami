"use client"

import { motion } from "motion/react"
import { CreditCard, Gavel, Info, MapPin, MessagesSquare, Truck, UserRound, type LucideIcon } from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { JAPAN_BARRIER_IDS, JAPAN_REQUEST_ANCHOR, type JapanBarrierId } from "@/lib/japan"

const ease = [0.21, 0.47, 0.32, 0.98] as const

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-japan-red">{a.eyebrow}</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-navy sm:text-4xl">
            {a.title}
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">{a.subtitle}</p>
        </motion.div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {JAPAN_BARRIER_IDS.map((id, i) => {
            const item = a.barriers[id]
            const Icon = ICONS[id]
            return (
              <motion.li
                key={id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: Math.min(i, 5) * 0.05, ease }}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                </span>
                <span className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-navy">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                </span>
              </motion.li>
            )
          })}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease }}
          className="mt-10 flex items-start gap-4 rounded-2xl border border-japan-red/25 bg-japan-red/[0.04] p-6"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-japan-red/10 text-japan-red">
            <Info className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <p className="text-pretty text-sm leading-relaxed text-navy">{a.note}</p>
        </motion.div>
      </div>
    </section>
  )
}
