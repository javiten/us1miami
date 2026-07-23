"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, MapPin, Check } from "lucide-react"
import { useI18n } from "@/components/language-provider"

const ease = [0.21, 0.47, 0.32, 0.98] as const

export function Hero() {
  const { t } = useI18n()
  const freebies = t.hero.freebies
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      {/* soft background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,169,255,0.16),transparent)]" />
        <div className="absolute right-0 top-24 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(15,125,255,0.12),transparent)]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"
          >
            <span className="flex h-2 w-2 items-center justify-center">
              <span className="h-2 w-2 animate-ping rounded-full bg-sky/60" />
              <span className="absolute h-2 w-2 rounded-full bg-primary" />
            </span>
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {t.hero.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="mt-6 text-balance text-5xl font-semibold leading-[1.03] tracking-tight text-navy sm:text-6xl lg:text-[4.25rem]"
          >
            {t.hero.titleLead}{" "}
            <span className="bg-gradient-to-r from-primary to-sky bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.19, ease }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#quote"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-10px_rgba(15,125,255,0.85)] transition-transform hover:-translate-y-0.5"
            >
              {t.hero.primaryCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/registro"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3.5 text-sm font-semibold text-navy shadow-sm transition-colors hover:bg-muted"
            >
              {t.hero.secondaryCta}
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2"
          >
            {freebies.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm font-medium text-navy">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/12">
                  <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-white p-2 shadow-[0_40px_80px_-40px_rgba(7,27,58,0.35)]">
            <Image
              src="/hero-logistics.png"
              alt={t.hero.imageAlt}
              width={900}
              height={720}
              priority
              className="h-auto w-full rounded-[1.6rem]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease }}
            className="absolute -bottom-5 -left-3 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-[0_18px_40px_-20px_rgba(7,27,58,0.4)] backdrop-blur-md sm:-left-6"
          >
            <p className="text-xs font-medium text-muted-foreground">{t.hero.startingFrom}</p>
            <p className="text-xl font-semibold text-navy">
              USD $55<span className="text-sm font-medium text-muted-foreground">{t.hero.perKg}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.72, ease }}
            className="absolute -right-3 top-6 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-[0_18px_40px_-20px_rgba(7,27,58,0.4)] backdrop-blur-md sm:-right-6"
          >
            <p className="text-xs font-medium text-muted-foreground">{t.hero.deliveryIn}</p>
            <p className="text-xl font-semibold text-navy">{t.hero.deliveryValue}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
