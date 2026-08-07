"use client"

import Link from "next/link"
import { ArrowRight, Check, Info } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"
import { CLOTHING_PRICING_ANCHOR } from "@/lib/clothing"
import { track } from "@/lib/analytics"

export function ClothingPricing() {
  const { t } = useI18n()
  const p = t.clothing.pricing

  return (
    <section id={CLOTHING_PRICING_ANCHOR} className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {/* Regular rate */}
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-8">
              <p className="text-sm font-medium text-muted-foreground">{p.regular.label}</p>
              <p className="mt-3 font-display text-5xl leading-none text-navy">{p.regular.value}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.regular.desc}</p>
            </div>
          </Reveal>

          {/* Volume rate — the signature element of the page. */}
          <Reveal delay={0.08} className="h-full">
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-primary/30 bg-navy p-8 shadow-[0_30px_60px_-30px_rgba(7,27,58,0.5)]">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-white/70">{p.volume.label}</p>
                <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {p.volume.badge}
                </span>
              </div>

              <p className="mt-3 font-display text-5xl leading-none text-white">{p.volume.value}</p>
              <p className="mt-4 text-sm leading-relaxed text-white/75">{p.volume.desc}</p>

              <Link
                href="/registro"
                onClick={() => track("clothing_pricing_cta_click", { cta: "create_address" })}
                className="group mt-8 inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
              >
                {t.clothing.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-8">
          <ul className="grid gap-3 sm:grid-cols-3">
            {p.notes.map((note) => (
              <li key={note} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.4} />
                {note}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* The eligibility qualifier. Deliberately prominent rather than fine
            print, so the lower rate is never mistaken for a guaranteed price. */}
        <Reveal className="mt-8">
          <div className="flex gap-3 rounded-2xl border border-border bg-muted/60 p-5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.2} />
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{p.disclaimer}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
