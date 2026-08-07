"use client"

import { Reveal } from "@/components/reveal"
import { Eyebrow, Headline, Lede } from "@/components/editorial/primitives"
import { cn } from "@/lib/utils"

/**
 * The eyebrow/title/subtitle block used by the four vertical landing pages.
 *
 * This now delegates to the shared editorial primitives rather than carrying
 * its own class strings. Previously it set the title in bold sans at text-3xl
 * while the redesigned homepage used the display serif, so moving between the
 * homepage and any vertical looked like moving between two different sites.
 * Because all four verticals share this component, they inherit the display
 * serif from one place.
 *
 * `tone="light"` is for the navy panels, where the eyebrow needs the sky accent
 * and the heading needs to invert.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = "dark",
  accent = "primary",
  align = "start",
  className,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  tone?: "dark" | "light"
  /** /japan sets this to "japan" so its eyebrows keep the vertical's crimson. */
  accent?: "primary" | "japan"
  align?: "start" | "center"
  className?: string
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <Eyebrow tone={tone === "light" ? "light" : "primary"} accent={accent}>
        {eyebrow}
      </Eyebrow>
      <Headline size="md" tone={tone} className="mt-4">
        {title}
      </Headline>
      {subtitle ? (
        <Lede tone={tone} className="mt-5">
          {subtitle}
        </Lede>
      ) : null}
    </Reveal>
  )
}
