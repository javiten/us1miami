"use client"

import { motion } from "motion/react"
import { Inbox, Warehouse, Combine, Plane, Zap, Headphones } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"

const icons = [Inbox, Warehouse, Combine, Plane, Zap, Headphones]

export function Services() {
  const { t } = useI18n()
  const services = t.services.items.map((item, i) => ({ ...item, icon: icons[i] }))
  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">{t.services.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            {t.services.title}
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">{t.services.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group h-full rounded-3xl border border-border bg-card p-7 shadow-[0_1px_0_rgba(7,27,58,0.04)] transition-shadow hover:shadow-[0_24px_50px_-30px_rgba(7,27,58,0.35)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-sky text-white shadow-[0_10px_24px_-10px_rgba(15,125,255,0.9)]">
                  <s.icon className="h-5 w-5" strokeWidth={2.2} />
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
