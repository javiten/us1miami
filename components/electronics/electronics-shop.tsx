"use client"

import { motion } from "motion/react"
import { Building2, ShoppingBag, Store } from "lucide-react"

import { useI18n } from "@/components/language-provider"

const ease = [0.21, 0.47, 0.32, 0.98] as const

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
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{s.eyebrow}</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-navy sm:text-4xl">
              {s.title}
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">{s.body}</p>
          </motion.div>

          <div className="flex flex-col gap-4">
            {s.points.map((point, i) => {
              const Icon = icons[i] ?? ShoppingBag
              return (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease }}
                  className="flex gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-navy">{point.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{point.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
