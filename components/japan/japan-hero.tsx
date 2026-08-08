"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Search } from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { HERO_HEADLINE } from "@/components/editorial/primitives"
import { JAPAN_HOW_ANCHOR, JAPAN_REQUEST_ANCHOR } from "@/lib/japan"
import { JapanRoute } from "@/components/japan/japan-route"
import { track } from "@/lib/analytics"

const ease = [0.21, 0.47, 0.32, 0.98] as const

export function JapanHero() {
  const { t } = useI18n()
  const j = t.japan

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      {/* Decorative backdrop: the precise rule grid, masked so it fades out
          rather than colliding with the content below. This is the vertical's
          signature, so it is the one texture here — the two coloured washes that
          used to sit on top of it were filler and competed with it. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="us1-japan-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
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
                {j.meta.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-navy" aria-current="page">
              {j.meta.breadcrumb}
            </li>
          </ol>
        </motion.nav>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-japan-red shadow-sm"
            >
              {/* A hinomaru-style red disc stands in for Japanese lettering
                  here. Real kanji would render as missing-glyph boxes: the
                  site's Latin webfonts carry no CJK coverage, and pulling in a
                  CJK face for two decorative characters is not a trade worth
                  making. Decorative, so it stays out of the accessibility
                  tree — the eyebrow text carries the meaning. */}
              <span className="h-2.5 w-2.5 rounded-full bg-japan-red" aria-hidden="true" />
              {j.hero.eyebrow}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease }}
              className={`mt-6 ${HERO_HEADLINE}`}
            >
              {j.hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease }}
              className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              {j.hero.body}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.19, ease }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href={`#${JAPAN_REQUEST_ANCHOR}`}
                onClick={() => track("japan_hero_cta_click", { cta: "request_purchase" })}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-10px_rgba(15,125,255,0.85)] transition-transform hover:-translate-y-0.5"
              >
                {j.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={`#${JAPAN_HOW_ANCHOR}`}
                onClick={() => track("japan_hero_cta_click", { cta: "how_it_works" })}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3.5 text-sm font-semibold text-navy shadow-sm transition-colors hover:bg-muted"
              >
                {j.hero.ctaSecondary}
              </a>
            </motion.div>

            {/* No rate is published for this vertical, so the "price" slot
                states the quoting model instead of a number. See lib/japan.ts. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26, ease }}
              className="mt-8 inline-flex items-start gap-3 rounded-2xl border border-border bg-white px-5 py-4 shadow-sm"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-japan-red/10 text-japan-red">
                <Search className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-xl font-semibold text-navy">{j.hero.quoteValue}</span>
                <span className="text-xs leading-relaxed text-muted-foreground">{j.hero.quoteNote}</span>
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-white p-2 shadow-[0_40px_80px_-40px_rgba(7,27,58,0.35)]">
              <Image
                src="/images/japan-hero.png"
                alt={j.hero.imageAlt}
                width={900}
                height={720}
                priority
                sizes="(min-width: 1024px) 46rem, 100vw"
                className="h-auto w-full rounded-[1.6rem]"
              />
            </div>

            {/* The route visual is the hero's signature element, so it overlaps
                the image rather than sitting in the text column. */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease }}
              className="mt-6 lg:absolute lg:-bottom-8 lg:-left-6 lg:mt-0 lg:w-[22rem]"
            >
              <JapanRoute />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
