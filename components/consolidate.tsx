"use client"

import Image from "next/image"
import { PiggyBank } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { Eyebrow, Headline, Lede, Section, Split } from "@/components/editorial/primitives"

/**
 * Slot 3 — editorial split-screen.
 *
 * The prose column is sticky on large screens so the photograph scrolls past a
 * fixed argument; on mobile the two simply stack. Previously this section was a
 * navy gradient panel containing an icon diagram, which made it read as one
 * more rounded card in a run of rounded cards.
 */
export function Consolidate() {
  const { t } = useI18n()

  return (
    <Section space="normal">
      <Split ratio="wide-media" align="start" reverse
        media={
          <Reveal delay={0.1}>
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg bg-muted sm:aspect-3/2 lg:aspect-4/5">
              <Image
                src="/home-consolidate.png"
                alt={t.consolidate.imageAlt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        }
      >
        <div className="lg:sticky lg:top-28">
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
        </div>
      </Split>
    </Section>
  )
}
