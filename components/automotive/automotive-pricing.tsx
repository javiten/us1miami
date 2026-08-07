"use client"

import { ArrowRight, Check, Percent, Plane } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"
import { AUTOMOTIVE_QUOTE_ANCHOR } from "@/lib/automotive"
import { track } from "@/lib/analytics"

export function AutomotivePricing() {
  const { t } = useI18n()
  const a = t.automotive.pricing

  const cards = [
    { ...a.shipping, icon: Plane, from: a.shipping.from },
    { ...a.assisted, icon: Percent, from: undefined },
  ]

  return (
    <section id="automotive-pricing" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={a.eyebrow} title={a.title} />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal key={card.label} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-8 shadow-[0_1px_0_rgba(7,27,58,0.04)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <card.icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{card.label}</p>
                </div>

                <p className="mt-6 flex items-baseline gap-2">
                  {card.from ? <span className="text-sm font-medium text-muted-foreground">{card.from}</span> : null}
                  {/* The figure carries the display serif so the numbers on this
                      page match the ones the homepage sets. */}
                  <span className="font-display text-5xl font-normal leading-none tracking-[-0.01em] text-navy">
                    {card.value}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">{card.unit}</span>
                </p>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>

                <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-navy/50">
                  {card.includesTitle}
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {card.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-navy/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.6} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Both figures are starting rates; this qualifier is the legal backbone
            of the whole pricing section and must stay adjacent to the numbers. */}
        <Reveal delay={0.14}>
          <div className="mt-10 rounded-2xl border border-border bg-muted/60 p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">{a.disclaimer}</p>
            <a
              href={`#${AUTOMOTIVE_QUOTE_ANCHOR}`}
              onClick={() => track("automotive_pricing_cta_click", {})}
              className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-12px_rgba(15,125,255,0.85)] transition-transform hover:-translate-y-0.5"
            >
              {a.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
