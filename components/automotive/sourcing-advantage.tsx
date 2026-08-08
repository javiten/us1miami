"use client"

import { Camera, Boxes, PackageCheck, ScanSearch, Store, Wrench } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"

const icons = [ScanSearch, Wrench, Store, PackageCheck, Camera, Boxes]

/**
 * The one dark section on the page, separating the capability story from the
 * commercial detail that follows it.
 *
 * Two things changed here. The two large radial-gradient circles that used to
 * float behind the content are gone: they were decorative blobs doing no work,
 * and on the navy field they mostly muddied the text contrast. The six frosted
 * cards are also gone — the section now sets the six capabilities loose on the
 * navy with no boxes and no rules at all.
 *
 * That absence is deliberate. This section sits immediately after a numbered
 * rail and a ruled index, both of which lean on hairlines, so a third ruled
 * treatment would flatten the page. Open space on a dark field reads as a
 * distinct movement without adding another border style.
 */
export function SourcingAdvantage() {
  const { t } = useI18n()
  const a = t.automotive.sourcing

  return (
    <section className="bg-navy py-20 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={a.eyebrow} title={a.title} subtitle={a.body} tone="light" />

        <ul className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {a.cards.map((card, i) => {
            const Icon = icons[i]
            return (
              <Reveal key={card.title} as="li" delay={i * 0.05} className="min-w-0">
                <Icon className="h-6 w-6 text-sky" strokeWidth={1.8} aria-hidden />
                <h3 className="mt-5 text-base font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-white/70">{card.desc}</p>
              </Reveal>
            )
          })}
        </ul>

        {/* Independent-provider disclosure, required so the sourcing claims above
            are not read as an official dealer relationship. */}
        <Reveal delay={0.12}>
          <p className="mt-16 max-w-3xl border-t border-white/15 pt-6 text-xs leading-relaxed text-white/65">
            {a.disclosure}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
