"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Search } from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { JAPAN_HOW_ANCHOR, JAPAN_REQUEST_ANCHOR } from "@/lib/japan"
import { JapanRoute } from "@/components/japan/japan-route"
import { track } from "@/lib/analytics"

const ease = [0.21, 0.47, 0.32, 0.98] as const

export function JapanHero() {
  const { t } = useI18n()
  const j = t.japan

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      {/* Decorative backdrop: the precise rule grid plus a single crimson wash,
          which is the only place the Japan accent appears at scale. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="us1-japan-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,16,46,0.10),transparent)]" />
        <div className="absolute right-0 top-32 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(15,125,255,0.10),transparent)]" />
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
              {/* The 日本 mark is the page's one piece of Japanese typography.
                  It is labelled for screen readers because the surrounding
                  eyebrow text already carries the meaning visually. */}
              <span aria-hidden="true" className="text-sm leading-none">
                日本
              </span>
              <span className="h-3 w-px bg-border" aria-hidden="true" />
              {j.hero.eyebrow}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease }}
              className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-[3.4rem]"
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
