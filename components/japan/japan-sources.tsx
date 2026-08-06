"use client"

import { motion } from "motion/react"
import { Gavel, Store, ShoppingBag, Cpu, ToyBrick, House, BookOpen, Diamond, type LucideIcon } from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { JAPAN_SOURCE_IDS, type JapanSourceId } from "@/lib/japan"

const ease = [0.21, 0.47, 0.32, 0.98] as const

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
    <section id="japan-sources" className="border-y border-border bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-japan-red">{s.eyebrow}</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-navy sm:text-4xl">
            {s.title}
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">{s.subtitle}</p>
        </motion.div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {JAPAN_SOURCE_IDS.map((id, i) => {
            const item = s.items[id]
            const Icon = ICONS[id]
            return (
              <motion.li
                key={id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.05, ease }}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/5 text-navy">
                  <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                </span>
                <h3 className="text-sm font-semibold text-navy">{item.name}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
              </motion.li>
            )
          })}
        </ul>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease }}
          className="mx-auto mt-10 max-w-3xl text-pretty text-center text-xs leading-relaxed text-muted-foreground"
        >
          {t.japan.marketplaces.disclaimer}
        </motion.p>
      </div>
    </section>
  )
}
