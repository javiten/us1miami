"use client"

import { motion } from "motion/react"
import {
  BatteryWarning,
  Ban,
  Package,
  Scale,
  ShieldQuestion,
  Store,
  type LucideIcon,
} from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { ELECTRONICS_NOTICE_ANCHOR, ELECTRONICS_NOTICE_IDS, type ElectronicsNoticeId } from "@/lib/electronics"

const ease = [0.21, 0.47, 0.32, 0.98] as const

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-sky">{n.eyebrow}</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            {n.title}
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-white/70">{n.subtitle}</p>
        </motion.div>

        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ELECTRONICS_NOTICE_IDS.map((id, i) => {
            const item = n.items[id]
            const Icon = ICONS[id]
            return (
              <motion.li
                key={id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.07, ease }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/15 text-sky">
                  <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{item.desc}</p>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
