"use client"

import Image from "next/image"
import { PiggyBank } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { Eyebrow, Headline, Lede, Section, Split } from "@/components/editorial/primitives"

/**
 * Slot 3 — editorial split-screen.
 *
 * Previously this section was a navy gradient panel containing an icon diagram,
 * which made it read as one more rounded card in a run of rounded cards.
 *
 * The columns are vertically centred rather than sticky-and-top-aligned: this
 * section has only a headline, a lede and a single benefit, so pinning short
 * prose beside a tall photograph left a large void beneath the text.
 */
export function Consolidate() {
  const { t } = useI18n()

  return (
    <Section space="normal">
      <Split ratio="even" align="center" reverse
        media={
          <Reveal delay={0.1}>
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted sm:aspect-3/2 lg:aspect-4/3">
              <Image
                src="/home-consolidate.png"
                alt={t.consolidate.imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        }
      >
        <Reveal>
          <Eyebrow>{t.consolidate.eyebrow}</Eyebrow>
          <Headline size="lg" className="mt-4">
            {t.consolidate.title}
          </Headline>
          <Lede className="mt-6">{t.consolidate.description}</Lede>

          <p className="mt-8 inline-flex items-center gap-2.5 border-t border-border pt-6 text-sm font-semibold text-navy">
            <PiggyBank className="h-5 w-5 shrink-0 text-primary" strokeWidth={2.2} />
            {t.consolidate.lowerCost}
          </p>
        </Reveal>
      </Split>
    </Section>
  )
}
