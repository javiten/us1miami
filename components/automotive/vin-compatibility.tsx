"use client"

import { AlertTriangle, Check } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"

export function VinCompatibility() {
  const { t } = useI18n()
  const a = t.automotive.vin

  return (
    <section className="border-t border-border bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow={a.eyebrow} title={a.title} />
            <Reveal delay={0.06}>
              <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">{a.body}</p>
            </Reveal>
          </div>

          <div className="flex flex-col gap-6">
            <Reveal delay={0.1}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {a.checklist.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-medium text-navy"
                  >
                    <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.6} />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Compatibility limitation — the single most important expectation
                to set before a customer authorizes a VIN-linked purchase. */}
            <Reveal delay={0.16}>
              <div className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" strokeWidth={2.2} />
                <p className="text-sm leading-relaxed text-amber-900">{a.disclaimer}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
