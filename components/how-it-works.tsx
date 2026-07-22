"use client"

import { motion } from "motion/react"
import { ShoppingCart, MapPin, PackageCheck, Combine, Plane, Home } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"

const icons = [ShoppingCart, MapPin, PackageCheck, Combine, Plane, Home]

export function HowItWorks() {
  const { t } = useI18n()
  const steps = t.how.steps.map((step, i) => ({ ...step, icon: icons[i] }))
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">{t.how.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            {t.how.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-full rounded-3xl border border-border bg-card p-6 shadow-[0_1px_0_rgba(7,27,58,0.04)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <s.icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <span className="text-4xl font-semibold tracking-tight text-muted/80 tabular-nums transition-colors group-hover:text-primary/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
