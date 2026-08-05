"use client"

import { Reveal } from "@/components/reveal"
import { cn } from "@/lib/utils"

/**
 * The eyebrow/title/subtitle block used by every marketing section on the site.
 * Extracted here so the automotive sections stay visually identical to the
 * existing homepage sections without copy-pasting the same class strings.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <Reveal className={cn("max-w-2xl", className)}>
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-navy sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-pretty text-lg text-muted-foreground">{subtitle}</p> : null}
    </Reveal>
  )
}
