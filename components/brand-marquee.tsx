"use client"

import { useRef, useState } from "react"
import { Reveal } from "@/components/reveal"
import type { Brand } from "@/lib/brands"
import { cn } from "@/lib/utils"

/**
 * Infinite horizontal brand marquee, shared by /automotive and /clothing.
 *
 * How the seamless loop works: the item list is rendered twice inside a track
 * that is animated to `translateX(-50%)`. At the end of the cycle the second
 * copy occupies the exact pixels the first copy started from, so restarting the
 * animation is invisible. Only the first copy is exposed to assistive tech; the
 * duplicate is `aria-hidden`.
 *
 * Motion, hover and touch:
 * - Pauses on pointer hover and on keyboard focus within the track.
 * - The viewport is a native horizontal scroller, so touch users can swipe.
 *   Dragging pauses the animation so the two do not fight each other.
 * - `prefers-reduced-motion` disables the animation entirely (see globals.css)
 *   and leaves a static, manually scrollable row.
 */
export function BrandMarquee({
  label,
  brands,
  disclaimer,
  /** Seconds for one full cycle. Longer list -> slower, calmer scroll. */
  durationSeconds = 60,
  className,
}: {
  label: string
  brands: readonly Brand[]
  disclaimer: string
  durationSeconds?: number
  className?: string
}) {
  const [paused, setPaused] = useState(false)
  const dragging = useRef(false)

  const items = (
    <>
      {brands.map((brand) => (
        <BrandItem key={brand.name} brand={brand} />
      ))}
    </>
  )

  return (
    <section aria-label={label} className={cn("border-y border-border bg-card py-12 sm:py-16", className)}>
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      </Reveal>

      <div
        className="group relative mt-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={() => {
          dragging.current = true
          setPaused(true)
        }}
        onTouchEnd={() => {
          dragging.current = false
          setPaused(false)
        }}
      >
        {/* Edge fades hide the items entering and leaving the viewport. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-card to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-card to-transparent sm:w-28" />

        {/* Native scroller so touch swipe works; scrollbar hidden for polish. */}
        <div
          className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label={label}
        >
          <div
            className="us1-marquee-track flex w-max items-center"
            data-paused={paused || undefined}
            style={{ ["--marquee-duration" as string]: `${durationSeconds}s` }}
          >
            {items}
            {/* Duplicate copy that makes the -50% loop seamless. */}
            <div className="flex items-center" aria-hidden="true">
              {items}
            </div>
          </div>
        </div>
      </div>

      <Reveal className="mx-auto mt-8 max-w-3xl px-4 sm:px-6">
        <p className="text-pretty text-center text-xs leading-relaxed text-muted-foreground">{disclaimer}</p>
      </Reveal>
    </section>
  )
}

function BrandItem({ brand }: { brand: Brand }) {
  return (
    <div
      className={cn(
        // The vertical padding is deliberate: it gives the pause-on-hover
        // target a comfortable height instead of a thin strip of text.
        "flex shrink-0 items-center justify-center px-6 py-4 sm:px-9",
        brand.wide ? "min-w-[190px]" : "min-w-[140px]",
      )}
    >
      {brand.logo ? (
        <img
          src={brand.logo || "/placeholder.svg"}
          alt={brand.name}
          loading="lazy"
          // Monochrome at rest, full colour on hover.
          className="h-7 w-auto opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-8"
        />
      ) : (
        <span
          className={cn(
            "whitespace-nowrap text-lg font-semibold tracking-tight text-muted-foreground/70 transition-colors duration-300 hover:text-primary sm:text-xl",
          )}
        >
          {brand.name}
        </span>
      )}
    </div>
  )
}
