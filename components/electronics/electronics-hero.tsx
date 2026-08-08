"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Cpu, Plane } from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { ELECTRONICS_NOTICE_ANCHOR } from "@/lib/electronics"
import { track } from "@/lib/analytics"

const ease = [0.21, 0.47, 0.32, 0.98] as const

export function ElectronicsHero() {
  const { t } = useI18n()
  const e = t.electronics

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
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
                {e.meta.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-navy" aria-current="page">
              {e.meta.breadcrumb}
            </li>
          </ol>
        </motion.nav>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-sm"
            >
              <Cpu className="h-3.5 w-3.5" strokeWidth={2.4} />
              {e.hero.eyebrow}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease }}
              // Matches the homepage hero exactly, as all four verticals now do.
              // Already the display serif, but a step smaller and without the
              // hero's tracking.
              className="mt-6 text-balance font-display text-[2.75rem] font-normal leading-[1.05] tracking-[-0.01em] text-navy sm:text-6xl lg:text-7xl"
            >
              {e.hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease }}
              className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              {e.hero.body}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.19, ease }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/registro"
                onClick={() => track("electronics_hero_cta_click", { cta: "create_address" })}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-10px_rgba(15,125,255,0.85)] transition-transform hover:-translate-y-0.5"
              >
                {e.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              {/* Electronics has no volume-pricing section to link to, so the
                  quote CTA points at the handling notices — the section that
                  explains why a final price needs a conversation. */}
              <a
                href={`#${ELECTRONICS_NOTICE_ANCHOR}`}
                onClick={() => track("electronics_hero_cta_click", { cta: "quote" })}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3.5 text-sm font-semibold text-navy shadow-sm transition-colors hover:bg-muted"
              >
                {e.hero.ctaSecondary}
              </a>
            </motion.div>

            {/* Electronics is a single "from" rate: the qualifier travels with
                the number so it is never read as a final quote. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26, ease }}
              className="mt-8 inline-flex flex-col gap-1 rounded-2xl border border-border bg-white px-5 py-4 shadow-sm"
            >
              <p className="font-display text-3xl leading-none text-navy">{e.hero.priceValue}</p>
              <p className="text-xs text-muted-foreground">{e.hero.priceNote}</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.34, ease }}
              className="mt-4 text-xs leading-relaxed text-muted-foreground"
            >
              {e.hero.delivery}
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
                src="/images/electronics-hero.png"
                alt={e.hero.imageAlt}
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
