"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { ShieldCheck, Clock, MapPin } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"

const icons = [ShieldCheck, Clock, MapPin]

export function WarehouseSection() {
  const { t } = useI18n()
  const points = t.warehouse.points.map((label, i) => ({ label, icon: icons[i] }))
  return (
    <section id="warehouse" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">{t.warehouse.eyebrow}</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight text-navy sm:text-4xl">
              {t.warehouse.title}
            </h2>
            <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
              {t.warehouse.description}
            </p>

            <ul className="mt-8 space-y-3">
              {points.map((p) => (
                <li key={p.label} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <p.icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <span className="text-sm font-medium text-navy">{p.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative overflow-hidden rounded-[2rem] border border-border bg-white p-2 shadow-[0_40px_80px_-40px_rgba(7,27,58,0.4)]"
            >
              <Image
                src="/warehouse.png"
                alt={t.warehouse.imageAlt}
                width={880}
                height={640}
                className="h-auto w-full rounded-[1.6rem]"
              />
              <div className="absolute bottom-5 left-5 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
                <p className="text-xs font-medium text-muted-foreground">{t.warehouse.overlayLabel}</p>
                <p className="text-sm font-semibold text-navy">{t.warehouse.overlayValue}</p>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
