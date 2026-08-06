"use client"

import { motion } from "motion/react"

import { useI18n } from "@/components/language-provider"
import { JAPAN_HOW_ANCHOR, JAPAN_STEP_IDS } from "@/lib/japan"

const ease = [0.21, 0.47, 0.32, 0.98] as const

/**
 * The six steps of an assisted Japanese purchase.
 *
 * This is a genuine sequence, so the step numbers are load-bearing rather than
 * decorative and the markup is an ordered list. Step 3 ("you approve the
 * total") is the commercial promise of the page: nothing is bought before the
 * customer confirms the cost.
 */
export function JapanHow() {
  const { t } = useI18n()
  const h = t.japan.how

  return (
    <section id={JAPAN_HOW_ANCHOR} className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-japan-red">{h.eyebrow}</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-navy sm:text-4xl">
            {h.title}
          </h2>
        </motion.div>

        <ol className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {JAPAN_STEP_IDS.map((id, i) => {
            const step = h.steps[id]
            return (
              <motion.li
                key={id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: Math.min(i, 5) * 0.06, ease }}
                className="relative flex flex-col gap-3 rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="text-base font-semibold leading-snug text-navy">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
