"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Boxes, Handshake, Plane, Store, Wrench } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { AUTOMOTIVE_QUOTE_ANCHOR } from "@/lib/automotive"
import { track } from "@/lib/analytics"

const ease = [0.21, 0.47, 0.32, 0.98] as const
const trustIcons = [Store, Boxes, Handshake, Plane]

export function AutomotiveHero() {
  const { t } = useI18n()
  const a = t.automotive
  const trust = a.trust.map((card, i) => ({ ...card, icon: trustIcons[i] }))

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,169,255,0.16),transparent)]" />
        <div className="absolute right-0 top-24 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(15,125,255,0.12),transparent)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Breadcrumb doubles as the page's structural context for SEO. */}
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
                {a.meta.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-navy" aria-current="page">
              {a.meta.breadcrumb}
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
              <Wrench className="h-3.5 w-3.5" strokeWidth={2.4} />
              {a.hero.eyebrow}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease }}
              // Matches the homepage hero exactly, as all four verticals now do.
              // Was bold sans at a smaller scale.
              className="mt-6 text-balance font-display text-[2.75rem] font-normal leading-[1.05] tracking-[-0.01em] text-navy sm:text-6xl lg:text-7xl"
            >
              {a.hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease }}
              className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              {a.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.19, ease }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href={`#${AUTOMOTIVE_QUOTE_ANCHOR}`}
                onClick={() => track("automotive_hero_cta_click", { cta: "quote" })}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-10px_rgba(15,125,255,0.85)] transition-transform hover:-translate-y-0.5"
              >
                {a.hero.primaryCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#automotive-how"
                onClick={() => track("automotive_hero_cta_click", { cta: "how_it_works" })}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3.5 text-sm font-semibold text-navy shadow-sm transition-colors hover:bg-muted"
              >
                {a.hero.secondaryCta}
              </a>
            </motion.div>

            {/* The two commercial figures, stated plainly and immediately
                qualified so the starting rate is never read as a final price. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26, ease }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <div className="rounded-2xl border border-border bg-white px-5 py-4 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">{a.hero.shippingLabel}</p>
                <p className="text-2xl font-semibold text-navy">
                  {a.hero.shippingValue}
                  <span className="text-sm font-medium text-muted-foreground">{a.hero.perKg}</span>
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white px-5 py-4 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground">{a.hero.assistedLabel}</p>
                <p className="text-2xl font-semibold text-navy">
                  {a.hero.assistedValue}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">{a.hero.assistedUnit}</span>
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.34, ease }}
              className="mt-4 max-w-xl text-xs leading-relaxed text-muted-foreground"
            >
              {a.hero.qualifier}
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
                src="/automotive-hero.png"
                alt={a.hero.imageAlt}
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
              <span className="text-sm font-semibold text-navy">{a.hero.routeFrom}</span>
              <Plane className="h-4 w-4 text-primary" strokeWidth={2.2} />
              <span className="text-sm font-semibold text-navy">{a.hero.routeTo}</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust strip. A real list of four peer items, so it is a <ul>. The
            titles stay h2: they are the first headings after the hero's h1, so
            demoting them to h3 skipped a level. */}
        <ul className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((card, i) => (
            <Reveal key={card.title} as="li" delay={i * 0.05} className="min-w-0">
              <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-[0_1px_0_rgba(7,27,58,0.04)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <card.icon className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-base font-semibold text-navy">{card.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
