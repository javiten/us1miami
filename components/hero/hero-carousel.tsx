"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { HERO_CAROUSEL_INTERVAL_MS } from "@/lib/automotive"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { HERO_SLIDES } from "@/components/hero/slides"

const CONTROL_CLASS =
  "flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

export function HeroCarousel() {
  const { t: dict } = useI18n()
  const t = dict.heroCarousel
  const prefersReducedMotion = useReducedMotion()

  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  // Paused transiently by hover/focus/tab-visibility.
  const [isPaused, setIsPaused] = useState(false)
  // Turned off permanently the first time the visitor drives the carousel, and
  // toggled directly by the play/pause button.
  const [autoplayEnabled, setAutoplayEnabled] = useState(true)

  const regionId = useId()
  const total = HERO_SLIDES.length
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef(0)

  const goTo = useCallback(
    (raw: number, reason: "auto" | "manual") => {
      const next = ((raw % total) + total) % total
      setDirection(raw > index ? 1 : -1)
      setIndex(next)
      if (reason === "manual") {
        setAutoplayEnabled(false)
        track("homepage_slider_change", { slide: HERO_SLIDES[next].id })
      }
    },
    [index, total],
  )

  const goNext = useCallback((reason: "auto" | "manual" = "manual") => goTo(index + 1, reason), [goTo, index])
  const goPrev = useCallback(() => goTo(index - 1, "manual"), [goTo, index])

  // Autoplay never runs for visitors who prefer reduced motion.
  const autoplayActive = !prefersReducedMotion && !isPaused && autoplayEnabled

  useEffect(() => {
    if (!autoplayActive) return
    const timer = window.setInterval(() => goNext("auto"), HERO_CAROUSEL_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [autoplayActive, goNext])

  // Pause while the tab is hidden so slides don't silently advance offscreen.
  useEffect(() => {
    const onVisibility = () => setIsPaused(document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  const status = t.status.replace("{n}", String(index + 1)).replace("{total}", String(total))

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label={t.region}
      className="relative overflow-hidden"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault()
          goNext()
        } else if (event.key === "ArrowLeft") {
          event.preventDefault()
          goPrev()
        }
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX
        touchDeltaX.current = 0
      }}
      onTouchMove={(e) => {
        if (touchStartX.current !== null) touchDeltaX.current = e.touches[0].clientX - touchStartX.current
      }}
      onTouchEnd={() => {
        if (Math.abs(touchDeltaX.current) > 60) {
          if (touchDeltaX.current < 0) goNext()
          else goPrev()
        }
        touchStartX.current = null
      }}
    >
      {/* Soft background accents, shared by every slide so the glow does not
          flicker between transitions. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,169,255,0.16),transparent)]" />
        <div className="absolute right-0 top-24 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(15,125,255,0.12),transparent)]" />
      </div>

      <div className="relative" id={regionId}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={HERO_SLIDES[index].id}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * 40 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -40 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div role="group" aria-roledescription="slide" aria-label={status}>
              {HERO_SLIDES[index].render(true)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 pb-6 sm:px-6 lg:px-8">
          <div className="pointer-events-auto flex flex-wrap items-center gap-2" role="tablist" aria-label={t.region}>
            {HERO_SLIDES.map((slide, i) => {
              const label = slide.label(dict)
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-controls={regionId}
                  onClick={() => goTo(i, "manual")}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    i === index
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/70 bg-background/80 text-muted-foreground backdrop-blur hover:text-foreground",
                  )}
                >
                  <span className="sr-only">
                    {t.goTo.replace("{n}", String(i + 1)).replace("{label}", label)}
                  </span>
                  <span aria-hidden="true">{label}</span>
                </button>
              )
            })}
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            {!prefersReducedMotion && (
              <button
                type="button"
                onClick={() => setAutoplayEnabled((v) => !v)}
                aria-pressed={!autoplayEnabled}
                className={CONTROL_CLASS}
              >
                <span className="sr-only">{autoplayEnabled ? t.pause : t.play}</span>
                {autoplayEnabled ? (
                  <Pause className="size-4" aria-hidden="true" />
                ) : (
                  <Play className="size-4" aria-hidden="true" />
                )}
              </button>
            )}
            <button type="button" onClick={goPrev} className={CONTROL_CLASS}>
              <span className="sr-only">{t.prev}</span>
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => goNext()} className={CONTROL_CLASS}>
              <span className="sr-only">{t.next}</span>
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Announces slide changes to assistive tech without moving focus. */}
      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </section>
  )
}
