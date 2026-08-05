"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Check, Wrench } from "lucide-react"
import { useI18n } from "@/components/language-provider"
import { track } from "@/lib/analytics"
import {
  ASSISTED_PURCHASE_FEE_PCT,
  AUTOMOTIVE_PATH,
  AUTOMOTIVE_QUOTE_ANCHOR,
  AUTOMOTIVE_RATE_PER_KG,
} from "@/lib/automotive"
import { SlideFrame, useSlideMotion } from "@/components/hero/slide-frame"

/**
 * Slide 2 — US1 Miami Automotive.
 * Brand-consistent with slide 1 but visually distinguished by the navy sourcing
 * panel behind the artwork, which is the visual signature of the Automotive
 * vertical throughout the site.
 */
export function SlideAutomotive({ isActive }: { isActive: boolean }) {
  const { t } = useI18n()
  const copy = t.heroCarousel.automotive
  const { item, visual } = useSlideMotion()

  return (
    <SlideFrame
      isActive={isActive}
      content={
        <>
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary"
          >
            <Wrench className="h-3.5 w-3.5" strokeWidth={2.4} />
            {copy.eyebrow}
          </motion.div>

          <motion.h2
            variants={item}
            className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-[3.75rem]"
          >
            {copy.title}
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {copy.description}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={AUTOMOTIVE_PATH}
              onClick={() => track("homepage_automotive_slide_click", { target: "explore" })}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-10px_rgba(15,125,255,0.85)] transition-transform hover:-translate-y-0.5"
            >
              {copy.primaryCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={`${AUTOMOTIVE_PATH}#${AUTOMOTIVE_QUOTE_ANCHOR}`}
              onClick={() => track("homepage_automotive_slide_click", { target: "quote" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3.5 text-sm font-semibold text-navy shadow-sm transition-colors hover:bg-muted"
            >
              {copy.secondaryCta}
            </Link>
          </motion.div>

          <motion.ul variants={item} className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {copy.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm font-medium text-navy">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/12">
                  <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                </span>
                {h}
              </li>
            ))}
          </motion.ul>
        </>
      }
      visual={
        <motion.div variants={visual} className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-navy/15 bg-navy p-2 shadow-[0_40px_80px_-40px_rgba(7,27,58,0.5)]">
            <Image
              src="/automotive-slide.png"
              alt={copy.imageAlt}
              width={900}
              height={720}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-auto w-full rounded-[1.6rem]"
            />
          </div>

          <div className="absolute -bottom-5 -left-3 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-[0_18px_40px_-20px_rgba(7,27,58,0.4)] backdrop-blur-md sm:-left-6">
            <p className="text-xs font-medium text-muted-foreground">{t.automotive.hero.shippingLabel}</p>
            <p className="text-xl font-semibold text-navy">
              {`USD $${AUTOMOTIVE_RATE_PER_KG}`}
              <span className="text-sm font-medium text-muted-foreground">{t.automotive.hero.perKg}</span>
            </p>
          </div>

          <div className="absolute -right-3 top-6 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-[0_18px_40px_-20px_rgba(7,27,58,0.4)] backdrop-blur-md sm:-right-6">
            <p className="text-xs font-medium text-muted-foreground">{t.automotive.hero.assistedLabel}</p>
            <p className="text-xl font-semibold text-navy">
              {`${ASSISTED_PURCHASE_FEE_PCT}%`}
            </p>
          </div>
        </motion.div>
      }
    />
  )
}
