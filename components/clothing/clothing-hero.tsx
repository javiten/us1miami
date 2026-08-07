"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Plane, Shirt } from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { CLOTHING_PRICING_ANCHOR } from "@/lib/clothing"
import { track } from "@/lib/analytics"

const ease = [0.21, 0.47, 0.32, 0.98] as const

export function ClothingHero() {
  const { t } = useI18n()
  const c = t.clothing

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,169,255,0.16),transparent)]" />
        <div className="absolute right-0 top-24 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(15,125,255,0.12),transparent)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          aria-label="Breadcrumb"
          className="mb-8"
        >
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="transition-colors hover:text-navy">
                {c.meta.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-navy" aria-current="page">
              {c.meta.breadcrumb}
            </li>
          </ol>
        </motion.nav>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-strong shadow-sm"
            >
              <Shirt className="h-3.5 w-3.5" strokeWidth={2.4} />
              {c.hero.eyebrow}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease }}
              className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-[3.5rem]"
            >
              {c.hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease }}
              className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              {c.hero.body}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.19, ease }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/registro"
                onClick={() => track("clothing_hero_cta_click", { cta: "create_address" })}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-strong-foreground shadow-[0_12px_28px_-10px_rgba(15,125,255,0.85)] transition-transform hover:-translate-y-0.5"
              >
                {c.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              {/* Both "quote" CTAs resolve to the volume-pricing section, which
                  is where the 55 vs 49 rates and their conditions live. */}
              <a
                href={`#${CLOTHING_PRICING_ANCHOR}`}
                onClick={() => track("clothing_hero_cta_click", { cta: "quote" })}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3.5 text-sm font-semibold text-navy shadow-sm transition-colors hover:bg-muted"
              >
                {c.hero.ctaSecondary}
              </a>
            </motion.div>

            {/* The headline rate is stated with its condition attached, so the
                lower number is never read as unconditional. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26, ease }}
              className="mt-8 inline-flex flex-wrap items-end gap-x-6 gap-y-2 rounded-2xl border border-border bg-white px-5 py-4 shadow-sm"
            >
              <div>
                <p className="text-3xl font-semibold text-navy">{c.hero.priceValue}</p>
                <p className="mt-1 text-xs font-medium text-primary-strong">{c.hero.priceCondition}</p>
              </div>
              <p className="text-xs text-muted-foreground">{c.hero.priceRegular}</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.34, ease }}
              className="mt-4 text-xs leading-relaxed text-muted-foreground"
            >
              {c.hero.delivery}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-white p-2 shadow-[0_40px_80px_-40px_rgba(7,27,58,0.35)]">
              <Image
                src="/images/clothing-hero.png"
                alt={c.hero.imageAlt}
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
              className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-[0_18px_40px_-20px_rgba(7,27,58,0.4)] backdrop-blur-md sm:-left-6"
            >
              <span className="text-sm font-semibold text-navy">Miami</span>
              <Plane className="h-4 w-4 text-primary" strokeWidth={2.2} />
              <span className="text-sm font-semibold text-navy">Argentina</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
