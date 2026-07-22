"use client"

import { motion } from "motion/react"
import { Check, ArrowRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"

export function Pricing() {
  const { t } = useI18n()
  const included = t.pricing.included
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">{t.pricing.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            {t.pricing.title}
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">{t.pricing.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-4xl">
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 shadow-[0_40px_90px_-50px_rgba(7,27,58,0.4)] sm:p-12"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(37,169,255,0.14),transparent)]" />
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  {t.pricing.startingAt}
                </span>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-6xl font-semibold tracking-tight text-navy sm:text-7xl">$55</span>
                  <span className="mb-2 text-lg font-medium text-muted-foreground">{t.pricing.unit}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t.pricing.transitLead}{" "}
                  <span className="font-semibold text-navy">{t.pricing.transitValue}</span> {t.pricing.transitTail}
                </p>

                <a
                  href="#quote"
                  className="group mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-10px_rgba(15,125,255,0.85)] transition-transform hover:-translate-y-0.5"
                >
                  {t.pricing.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

              <div className="rounded-3xl border border-border bg-background p-6 sm:p-8">
                <p className="text-sm font-semibold text-navy">{t.pricing.includesTitle}</p>
                <ul className="mt-4 space-y-3">
                  {included.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/12">
                        <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}
