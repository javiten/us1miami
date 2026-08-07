"use client"

import Image from "next/image"
import type { LucideIcon } from "lucide-react"
import { Inbox, Warehouse, Combine, Plane, Zap, Headphones } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { Eyebrow, Headline, Lede, Section } from "@/components/editorial/primitives"
import { cn } from "@/lib/utils"

const icons = [Inbox, Warehouse, Combine, Plane, Zap, Headphones]

/**
 * Slot 6 — asymmetric bento grid.
 *
 * All six services used to be identical cards in a 3-up grid. Here the first
 * one becomes a tall photographic feature tile spanning two columns and two
 * rows, and one mid-grid tile is inverted to navy. The result reads as an
 * arrangement rather than a list, which is the whole point of this slot.
 *
 * The span classes only apply from `lg`; below that every tile is full width,
 * so nothing depends on a fragile implicit grid flow on small screens.
 */
export function Services() {
  const { t } = useI18n()
  const services = t.services.items.map((item, i) => ({ ...item, icon: icons[i] }))
  const [feature, ...rest] = services

  return (
    <Section id="services" space="normal" aria-labelledby="services-title">
      <Reveal className="max-w-2xl">
        <Eyebrow>{t.services.eyebrow}</Eyebrow>
        <Headline id="services-title" size="lg" className="mt-4">
          {t.services.title}
        </Headline>
        <Lede className="mt-5">{t.services.subtitle}</Lede>
      </Reveal>

      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {/* Feature tile — photographic, spans 2x2. */}
        <Reveal className="lg:col-span-2 lg:row-span-2">
          <article className="group relative isolate flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-lg bg-navy p-8 lg:min-h-[30rem]">
            <Image
              src="/home-receiving.png"
              alt={t.services.featureImageAlt}
              fill
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="-z-10 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/95 via-navy/60 to-navy/20"
            />
            <feature.icon className="h-6 w-6 text-sky" strokeWidth={2} />
            <h3 className="mt-5 font-display text-2xl leading-tight text-white md:text-3xl">{feature.title}</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-pretty text-white/70">{feature.desc}</p>
          </article>
        </Reveal>

        {rest.map((s, i) => (
          <Reveal key={s.title} delay={0.05 + i * 0.05}>
            {/* The fourth tile of the remainder is inverted to break the run of
                light tiles at the point where the grid returns to full width. */}
            <ServiceTile service={s} inverted={i === 3} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

function ServiceTile({
  service,
  inverted = false,
}: {
  service: { title: string; desc: string; icon: LucideIcon }
  inverted?: boolean
}) {
  const Icon = service.icon
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-lg border p-7 transition-colors",
        inverted
          ? "border-navy bg-navy text-white"
          : "border-border bg-card hover:border-primary/40",
      )}
    >
      <Icon className={cn("h-6 w-6", inverted ? "text-sky" : "text-primary")} strokeWidth={2} />
      <h3 className={cn("mt-5 text-lg font-semibold", inverted ? "text-white" : "text-navy")}>{service.title}</h3>
      <p
        className={cn(
          "mt-2 text-sm leading-relaxed text-pretty",
          inverted ? "text-white/70" : "text-muted-foreground",
        )}
      >
        {service.desc}
      </p>
    </article>
  )
}
