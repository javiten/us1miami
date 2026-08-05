"use client"

import { Camera, Boxes, PackageCheck, ScanSearch, Store, Wrench } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"

const icons = [ScanSearch, Wrench, Store, PackageCheck, Camera, Boxes]

export function SourcingAdvantage() {
  const { t } = useI18n()
  const a = t.automotive.sourcing

  return (
    // The one dark section on the page, used to separate the capability story
    // from the commercial detail that follows it.
    <section className="relative overflow-hidden bg-navy py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(37,169,255,0.18),transparent)]" />
        <div className="absolute -bottom-32 right-0 h-[420px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(15,125,255,0.16),transparent)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky">{a.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{a.title}</h2>
          <p className="mt-4 text-pretty leading-relaxed text-white/70">{a.body}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {a.cards.map((card, i) => {
            const Icon = icons[i]
            return (
              <Reveal key={card.title} delay={i * 0.05}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky/15 text-sky">
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{card.desc}</p>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Independent-provider disclosure, required so the sourcing claims above
            are not read as an official dealer relationship. */}
        <Reveal delay={0.12}>
          <p className="mt-12 max-w-3xl border-t border-white/10 pt-6 text-xs leading-relaxed text-white/55">
            {a.disclosure}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
