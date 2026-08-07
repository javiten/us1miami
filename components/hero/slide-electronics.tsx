"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Cpu } from "lucide-react"
import { useI18n } from "@/components/language-provider"
import { track } from "@/lib/analytics"
import { ELECTRONICS_PATH, ELECTRONICS_RATE_PER_KG } from "@/lib/electronics"
import { SlideFrame, useSlideMotion } from "@/components/hero/slide-frame"

/**
 * Slide 4 — US1 Miami Electronics.
 *
 * Mirrors `slide-automotive.tsx` and `slide-clothing.tsx` exactly so all four
 * slides share one entrance choreography and the carousel height stays stable.
 */
export function SlideElectronics({ isActive }: { isActive: boolean }) {
  const { t } = useI18n()
  const copy = t.heroCarousel.electronics
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
            <Cpu className="h-3.5 w-3.5" strokeWidth={2.4} />
            {copy.eyebrow}
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-[3.75rem]"
          >
            {copy.title}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {copy.description}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={ELECTRONICS_PATH}
              onClick={() => track("homepage_electronics_slide_click", { target: "explore" })}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-10px_rgba(15,125,255,0.85)] transition-transform hover:-translate-y-0.5"
            >
              {copy.primaryCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </>
      }
      visual={
        <motion.div variants={visual} className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-navy/15 bg-navy p-2 shadow-[0_40px_80px_-40px_rgba(7,27,58,0.5)]">
            <Image
              src="/electronics-slide.png"
              alt={copy.imageAlt}
              width={900}
              height={720}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-auto w-full rounded-[1.6rem]"
            />
          </div>

          <div className="absolute -bottom-5 -left-3 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-[0_18px_40px_-20px_rgba(7,27,58,0.4)] backdrop-blur-md sm:-left-6">
            <p className="text-xs font-medium text-muted-foreground">{copy.shippingLabel}</p>
            <p className="text-xl font-semibold text-navy">
              {`USD $${ELECTRONICS_RATE_PER_KG}`}
              <span className="text-sm font-medium text-muted-foreground">{copy.perKg}</span>
            </p>
          </div>

          <div className="absolute -right-3 top-6 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-[0_18px_40px_-20px_rgba(7,27,58,0.4)] backdrop-blur-md sm:-right-6">
            <p className="text-xs font-medium text-muted-foreground">{copy.deliveryLabel}</p>
            <p className="text-xl font-semibold text-navy">{copy.deliveryValue}</p>
          </div>
        </motion.div>
      }
    />
  )
}
