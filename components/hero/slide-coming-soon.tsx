"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Clock } from "lucide-react"
import { useI18n } from "@/components/language-provider"
import { SlideFrame, useSlideMotion } from "@/components/hero/slide-frame"

/**
 * Shared shell for the two future-service slides (3 and 4).
 *
 * These are intentionally finished-looking placeholders: real headline, real
 * supporting copy, a non-primary "coming soon" badge instead of a CTA, and an
 * abstract visual that can be swapped for product artwork without touching the
 * layout.
 *
 * TODO: Replace Slide 3 content and visual in a future update.
 * TODO: Replace Slide 4 content and visual in a future update.
 * When a slide graduates into a real service, give it its own component
 * (mirroring `slide-automotive.tsx`), add the CTAs, and swap it into the
 * `HERO_SLIDES` array in `components/hero/slides.ts`.
 */
export function SlideComingSoon({
  isActive,
  variant,
}: {
  isActive: boolean
  /** Chooses copy + artwork. `network` is slide 3, `layers` is slide 4. */
  variant: "network" | "layers"
}) {
  const { t } = useI18n()
  const copy = variant === "network" ? t.heroCarousel.soonNetwork : t.heroCarousel.soonLayers
  const src = variant === "network" ? "/coming-soon-network.png" : "/coming-soon-layers.png"
  const { item, visual } = useSlideMotion()

  return (
    <SlideFrame
      isActive={isActive}
      content={
        <>
          <motion.p
            variants={item}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            {copy.eyebrow}
          </motion.p>

          <motion.h2
            variants={item}
            className="mt-5 text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-[3.75rem]"
          >
            {copy.title}
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {copy.description}
          </motion.p>

          {/* Deliberately not a CTA: the service is not live, so this reads as
              status, not as an action. */}
          <motion.p
            variants={item}
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-border bg-muted px-5 py-3 text-sm font-semibold text-muted-foreground"
          >
            <Clock className="h-4 w-4" strokeWidth={2.2} />
            {copy.badge}
          </motion.p>
        </>
      }
      visual={
        <motion.div variants={visual} className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-navy/15 bg-navy p-2 shadow-[0_40px_80px_-40px_rgba(7,27,58,0.5)]">
            <Image
              src={src}
              alt={copy.imageAlt}
              width={900}
              height={720}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-auto w-full rounded-[1.6rem]"
            />
          </div>
        </motion.div>
      }
    />
  )
}
