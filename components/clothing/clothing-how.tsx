"use client"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"

export function ClothingHow() {
  const { t } = useI18n()
  const h = t.clothing.how

  return (
    <section id="clothing-how" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={h.eyebrow} title={h.title} />

        {/* A genuine sequence, so the numbered markers are load-bearing. */}
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {h.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06} className="h-full">
              <li className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-[0_1px_0_rgba(7,27,58,0.04)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-base font-semibold leading-snug text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
