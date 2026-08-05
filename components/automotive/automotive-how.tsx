"use client"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"

export function AutomotiveHow() {
  const { t } = useI18n()
  const a = t.automotive.how

  return (
    <section id="automotive-how" className="scroll-mt-28 border-t border-border bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={a.eyebrow} title={a.title} />

        {/* A genuine sequence, so the numbered markers are load-bearing here. */}
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {a.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.05}>
              <li className="relative h-full rounded-3xl border border-border bg-white p-7 shadow-[0_1px_0_rgba(7,27,58,0.04)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-base font-semibold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
