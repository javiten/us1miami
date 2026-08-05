"use client"

import {
  Armchair,
  Cog,
  Disc3,
  Fan,
  Filter,
  Fingerprint,
  Gauge,
  Hash,
  Lightbulb,
  Settings2,
  Sparkles,
  Waypoints,
} from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"
import { PART_CATEGORY_KEYS, type PartCategoryKey } from "@/lib/automotive"

const ICONS: Record<PartCategoryKey, typeof Cog> = {
  engine: Cog,
  brakes: Disc3,
  suspension: Waypoints,
  sensors: Gauge,
  transmission: Settings2,
  filters: Filter,
  lighting: Lightbulb,
  airConditioning: Fan,
  accessories: Armchair,
  specialty: Sparkles,
  partNumber: Hash,
  vinSpecific: Fingerprint,
}

export function PartCategories() {
  const { t } = useI18n()
  const a = t.automotive.categories

  return (
    <section id="automotive-categories" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={a.eyebrow} title={a.title} />

        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PART_CATEGORY_KEYS.map((key, i) => {
            const Icon = ICONS[key]
            return (
              <Reveal key={key} delay={i * 0.03}>
                <li className="flex h-full items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/30">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <span className="text-sm font-medium text-navy">{a.items[key]}</span>
                </li>
              </Reveal>
            )
          })}
        </ul>

        {/* Eligibility caveat sits directly under the list it qualifies. */}
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">{a.note}</p>
        </Reveal>
      </div>
    </section>
  )
}
