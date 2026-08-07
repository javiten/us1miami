"use client"

import { Check, ShoppingBag, Sparkles } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"
import { AUTOMOTIVE_QUOTE_ANCHOR } from "@/lib/automotive"
import { track } from "@/lib/analytics"

export function PurchaseOptions() {
  const { t } = useI18n()
  const a = t.automotive.options

  return (
    <section id="automotive-options" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={a.eyebrow} title={a.title} subtitle={a.subtitle} />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Option A — customer buys directly. Deliberately listed first so the
              free path is the default reading order, not the paid one. */}
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-8 shadow-[0_1px_0_rgba(7,27,58,0.04)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy/5 text-navy">
                <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-navy">{a.self.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.self.desc}</p>

              <ul className="mt-7 flex flex-col gap-3">
                {a.self.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-navy/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.6} />
                    {p}
                  </li>
                ))}
              </ul>

              <a
                href="#warehouse"
                onClick={() => track("automotive_option_cta_click", { option: "self" })}
                className="mt-8 inline-flex items-center justify-center rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-navy shadow-sm transition-colors hover:bg-muted"
              >
                {a.self.cta}
              </a>
            </div>
          </Reveal>

          {/* Option B — assisted purchase. Accented because it is the paid
              service, with the fee stated on the card itself. */}
          <Reveal delay={0.08}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-primary/25 bg-white p-8 shadow-[0_24px_60px_-34px_rgba(15,125,255,0.45)]">
              <span className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[radial-gradient(closest-side,rgba(37,169,255,0.16),transparent)]" />

              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                  {a.assisted.label}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-navy">{a.assisted.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.assisted.desc}</p>

              <p className="mt-6 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-navy">{a.assisted.feeValue}</span>
                <span className="text-sm font-medium text-muted-foreground">{a.assisted.feeUnit}</span>
              </p>

              <ul className="mt-7 flex flex-col gap-3">
                {a.assisted.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-navy/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.6} />
                    {p}
                  </li>
                ))}
              </ul>

              <a
                href={`#${AUTOMOTIVE_QUOTE_ANCHOR}`}
                onClick={() => track("automotive_option_cta_click", { option: "assisted" })}
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-12px_rgba(15,125,255,0.85)] transition-transform hover:-translate-y-0.5"
              >
                {a.assisted.cta}
              </a>

              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{a.assisted.note}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
