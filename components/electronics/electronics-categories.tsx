"use client"

import { motion } from "motion/react"
import {
  Camera,
  Cable,
  Gamepad2,
  Headphones,
  House,
  Keyboard,
  Laptop,
  Smartphone,
  Watch,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { ELECTRONICS_CATEGORY_IDS, type ElectronicsCategoryId } from "@/lib/electronics"

const ease = [0.21, 0.47, 0.32, 0.98] as const

/**
 * Icons live next to the markup that renders them rather than in the config,
 * so `lib/electronics.ts` stays free of React imports and the copy dictionary
 * stays free of presentation concerns.
 */
const ICONS: Record<ElectronicsCategoryId, LucideIcon> = {
  smartphones: Smartphone,
  computers: Laptop,
  consoles: Gamepad2,
  audio: Headphones,
  cameras: Camera,
  smartwatches: Watch,
  accessories: Keyboard,
  smartHome: House,
  smallElectronics: Zap,
  replacements: Cable,
}

export function ElectronicsCategories() {
  const { t } = useI18n()
  const c = t.electronics.categories

  return (
    <section id="electronics-categories" className="border-y border-border bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{c.eyebrow}</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-navy sm:text-4xl">
            {c.title}
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">{c.subtitle}</p>
        </motion.div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {ELECTRONICS_CATEGORY_IDS.map((id, i) => {
            const item = c.items[id]
            const Icon = ICONS[id]
            return (
              <motion.li
                key={id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: Math.min(i, 5) * 0.05, ease }}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                </span>
                <h3 className="text-sm font-semibold text-navy">{item.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
