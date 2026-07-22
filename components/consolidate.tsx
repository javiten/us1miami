"use client"

import { motion } from "motion/react"
import { Package, ArrowDown, PiggyBank } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"

export function Consolidate() {
  const { t } = useI18n()
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 rounded-[2.5rem] border border-border bg-gradient-to-br from-navy to-[#0a2452] p-8 shadow-[0_40px_90px_-50px_rgba(7,27,58,0.7)] sm:p-12 lg:grid-cols-2 lg:p-16">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-sky">{t.consolidate.eyebrow}</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              {t.consolidate.title}
            </h2>
            <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-white/70">
              {t.consolidate.description}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col items-center gap-5">
              <div className="flex flex-wrap justify-center gap-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 18 }}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm"
                  >
                    <Package className="h-6 w-6 text-sky" strokeWidth={2} />
                  </motion.div>
                ))}
              </div>

              <ArrowDown className="h-6 w-6 text-white/40" />

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 220, damping: 16 }}
                className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary shadow-[0_20px_40px_-16px_rgba(15,125,255,0.9)]"
              >
                <Package className="h-11 w-11 text-white" strokeWidth={1.8} />
              </motion.div>

              <ArrowDown className="h-6 w-6 text-white/40" />

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-2.5 rounded-2xl bg-white px-5 py-3 shadow-lg"
              >
                <PiggyBank className="h-5 w-5 text-primary" strokeWidth={2.2} />
                <span className="text-sm font-semibold text-navy">{t.consolidate.lowerCost}</span>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
