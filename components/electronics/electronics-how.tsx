"use client"

import { motion } from "motion/react"

import { useI18n } from "@/components/language-provider"
import { ELECTRONICS_STEP_IDS } from "@/lib/electronics"

const ease = [0.21, 0.47, 0.32, 0.98] as const

/**
 * The six fulfilment steps. Rendered as an ordered list because the sequence
 * is the content — the numbers are load-bearing here, not decoration.
 */
export function ElectronicsHow() {
  const { t } = useI18n()
  const h = t.electronics.how

  return (
    <section id="how-it-works" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{h.eyebrow}</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-navy sm:text-4xl">
            {h.title}
          </h2>
        </motion.div>

        <ol className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ELECTRONICS_STEP_IDS.map((id, i) => {
            const step = h.steps[id]
            return (
              <motion.li
                key={id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.07, ease }}
                className="relative rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
