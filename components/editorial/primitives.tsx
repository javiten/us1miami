import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Editorial layout primitives                                         */
/*                                                                     */
/* A small vocabulary of section shapes shared by the homepage and the  */
/* four vertical pages. The point is that section *variety* becomes     */
/* declarative: a page picks Split / FullBleed / Section rather than    */
/* every section independently reinventing a centered card grid.        */
/*                                                                     */
/* These are server components on purpose — only the entrance animation */
/* (Reveal) needs the client, so pages can compose these freely.        */
/* ------------------------------------------------------------------ */

/** Shared horizontal container. Matches the width the site already used. */
export const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"

type Tone = "default" | "muted" | "card" | "navy"

const TONE_CLASS: Record<Tone, string> = {
  default: "bg-background text-foreground",
  muted: "bg-muted text-foreground",
  card: "bg-card text-card-foreground",
  navy: "bg-navy text-white",
}

/** Vertical rhythm. `spacious` is for the pricing statement and closing CTA. */
const SPACE_CLASS = {
  normal: "py-20 md:py-28",
  spacious: "py-24 md:py-32 lg:py-40",
  tight: "py-14 md:py-20",
} as const

export function Section({
  children,
  id,
  tone = "default",
  space = "normal",
  bleed = false,
  className,
  as: Tag = "section",
  "aria-labelledby": ariaLabelledBy,
}: {
  children: ReactNode
  id?: string
  tone?: Tone
  space?: keyof typeof SPACE_CLASS
  /** Skip the inner container when the section manages its own full-width layout. */
  bleed?: boolean
  className?: string
  as?: "section" | "div" | "aside"
  "aria-labelledby"?: string
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn("relative", TONE_CLASS[tone], SPACE_CLASS[space], className)}
    >
      {bleed ? children : <div className={CONTAINER}>{children}</div>}
    </Tag>
  )
}

/** Small uppercase kicker above a headline. */
export function Eyebrow({
  children,
  tone = "primary",
  className,
}: {
  children: ReactNode
  tone?: "primary" | "light"
  className?: string
}) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.18em]",
        tone === "light" ? "text-sky" : "text-primary",
        className,
      )}
    >
      {children}
    </p>
  )
}

/**
 * Section headline set in the display serif.
 *
 * `level` controls the heading element so pages keep a valid outline, while
 * `size` controls the visual scale independently — the two are deliberately
 * decoupled so a visually large headline can still be an h3 where the document
 * structure calls for it.
 */
export function Headline({
  children,
  id,
  level = 2,
  size = "lg",
  tone = "dark",
  className,
}: {
  children: ReactNode
  id?: string
  level?: 1 | 2 | 3
  size?: "sm" | "md" | "lg" | "xl"
  tone?: "dark" | "light"
  className?: string
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3"
  const SIZE = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-4xl md:text-6xl lg:text-7xl",
  }[size]

  return (
    <Tag
      id={id}
      className={cn(
        "font-display font-normal leading-[1.05] tracking-[-0.01em] text-balance",
        SIZE,
        tone === "light" ? "text-white" : "text-navy",
        className,
      )}
    >
      {children}
    </Tag>
  )
}

/** Supporting paragraph under a headline. Stays on the sans face. */
export function Lede({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode
  tone?: "dark" | "light"
  className?: string
}) {
  return (
    <p
      className={cn(
        "max-w-xl text-base leading-relaxed text-pretty md:text-lg",
        tone === "light" ? "text-white/70" : "text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  )
}

/**
 * Two-column editorial layout that collapses to a single column on mobile.
 *
 * `media` is rendered second in the DOM so screen readers and mobile users get
 * the prose first; `reverse` only flips the visual order on large screens via
 * grid column placement, which keeps that reading order intact.
 */
export function Split({
  children,
  media,
  reverse = false,
  ratio = "even",
  align = "center",
  className,
}: {
  children: ReactNode
  media: ReactNode
  reverse?: boolean
  ratio?: "even" | "wide-media" | "wide-prose"
  align?: "center" | "start"
  className?: string
}) {
  const COLS = {
    even: "lg:grid-cols-2",
    "wide-media": "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]",
    "wide-prose": "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]",
  }[ratio]

  return (
    <div
      className={cn(
        "grid gap-12 lg:gap-16",
        COLS,
        align === "center" ? "items-center" : "items-start",
        className,
      )}
    >
      <div className={cn("min-w-0", reverse && "lg:order-2")}>{children}</div>
      <div className={cn("min-w-0", reverse && "lg:order-1")}>{media}</div>
    </div>
  )
}

/**
 * Full-width photographic band with content laid over it.
 *
 * The scrim is a fixed navy wash rather than a decorative gradient: it exists
 * so white text keeps its contrast ratio over an arbitrary photograph.
 */
export function FullBleed({
  children,
  image,
  minHeight = "tall",
  overlay = "strong",
  className,
}: {
  children: ReactNode
  /** Absolutely-positioned <Image fill> lives here. */
  image: ReactNode
  minHeight?: "tall" | "short"
  overlay?: "strong" | "soft"
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative isolate flex w-full items-end overflow-hidden bg-navy",
        minHeight === "tall" ? "min-h-[32rem] md:min-h-[38rem]" : "min-h-[22rem] md:min-h-[26rem]",
        className,
      )}
    >
      <div className="absolute inset-0 -z-10">{image}</div>
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10",
          overlay === "strong"
            ? "bg-navy/72 md:bg-gradient-to-r md:from-navy/92 md:via-navy/70 md:to-navy/35"
            : "bg-navy/55",
        )}
      />
      <div className={cn(CONTAINER, "py-16 md:py-20")}>{children}</div>
    </div>
  )
}

/** Large display numeral with a label. Used by the factual proof band. */
export function Stat({
  value,
  label,
  tone = "light",
}: {
  value: string
  label: string
  tone?: "dark" | "light"
}) {
  return (
    <div className="min-w-0">
      <p
        className={cn(
          "font-display text-4xl leading-none md:text-5xl",
          tone === "light" ? "text-white" : "text-navy",
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "mt-3 text-sm leading-relaxed text-pretty",
          tone === "light" ? "text-white/65" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
    </div>
  )
}
