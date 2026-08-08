"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, MapPin, Check } from "lucide-react"
import { useI18n } from "@/components/language-provider"
import { SHIPPING_RATES } from "@/lib/shipping-rates"
import { ctaClasses } from "@/components/editorial/primitives"
import { SlideFrame, useSlideMotion } from "@/components/hero/slide-frame"

/**
 * Slide 1 — the original US1 Miami international courier hero.
 * Content, hierarchy, CTAs, price messaging and artwork are preserved from the
 * previous static hero; only the entrance animation is now driven by the
 * carousel's active state.
 */
export function SlideCourier({ isActive }: { isActive: boolean }) {
  const { t } = useI18n()
  const { item, visual } = useSlideMotion()

  return (
    <SlideFrame
      isActive={isActive}
      content={
        <>
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"
          >
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="h-2 w-2 animate-ping rounded-full bg-sky/60" />
              <span className="absolute h-2 w-2 rounded-full bg-primary" />
            </span>
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {t.hero.badge}
          </motion.div>

          {/* h1: only one slide is mounted at a time, so the active slide's
              headline is the page's single top-level heading. */}
          <motion.h1
            variants={item}
            className="mt-6 text-balance font-display text-[2.75rem] font-normal leading-[1.05] tracking-[-0.01em] text-navy sm:text-6xl lg:text-7xl"
          >
            {t.hero.titleLead}{" "}
            <span className="text-primary">
              {t.hero.titleHighlight}
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t.hero.description}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#quote"
              className={ctaClasses("primary")}
            >
              {t.hero.primaryCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/registro"
              className={ctaClasses("secondary")}
            >
              {t.hero.secondaryCta}
            </Link>
          </motion.div>

          <motion.ul variants={item} className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {t.hero.freebies.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm font-medium text-navy">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/12">
                  <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </motion.ul>
        </>
      }
      visual={
        <motion.div variants={visual} className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-white p-2 shadow-[0_40px_80px_-40px_rgba(7,27,58,0.35)]">
            <Image
              src="/hero-logistics.png"
              alt={t.hero.imageAlt}
              width={900}
              height={720}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-auto w-full rounded-[1.6rem]"
            />
          </div>

          <div className="absolute -bottom-5 -left-3 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-[0_18px_40px_-20px_rgba(7,27,58,0.4)] backdrop-blur-md sm:-left-6">
            {/* The "from" figure is the marketing floor in lib/shipping-rates,
                NOT the billing engine's RATE_TIER_1. Those are different numbers
                on purpose: this is the lowest rate reachable across the
                verticals, while RATE_TIER_1 is what a general consolidated
                shipment is actually invoiced at. Pointing this at the invoice
                constant would mean a pricing edit here silently repriced real
                invoices. */}
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t.hero.startingFrom}</p>
            <p className="flex items-baseline gap-1 font-display text-2xl leading-tight text-navy">
              {`USD $${SHIPPING_RATES.homepageStartingRate}`}
              <span className="font-sans text-sm font-medium text-muted-foreground">{t.hero.perKg}</span>
            </p>
          </div>

          <div className="absolute -right-3 top-6 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-[0_18px_40px_-20px_rgba(7,27,58,0.4)] backdrop-blur-md sm:-right-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t.hero.deliveryIn}</p>
            <p className="flex items-baseline gap-1 font-display text-2xl leading-tight text-navy">{t.hero.deliveryValue}</p>
          </div>
        </motion.div>
      }
    />
  )
}
