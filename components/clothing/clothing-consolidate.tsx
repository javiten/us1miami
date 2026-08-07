"use client"

import Image from "next/image"

import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { Eyebrow, Headline, Lede, Section, Split } from "@/components/editorial/primitives"

/**
 * The consolidation explainer, as a two-column editorial split.
 *
 * Three changes: it sat on `bg-card` directly after the categories section,
 * which is also `bg-card`, so the boundary between them was invisible and the
 * two read as one very long white stretch — it now sits on the page background.
 * The headline was a raw `h2`, so it missed the display serif every other
 * section headline uses. And the supporting points were rounded cards with a
 * left accent stripe; they are now hairline-separated rows, which keeps the
 * emphasis on the photograph.
 */
export function ClothingConsolidate() {
  const { t } = useI18n()
  const c = t.clothing.consolidate

  return (
    <Section id="clothing-consolidate" tone="default">
      <Split
        ratio="wide-prose"
        media={
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-2 shadow-[0_30px_60px_-35px_rgba(7,27,58,0.3)]">
              <Image
                src="/images/clothing-consolidate.png"
                alt={c.imageAlt}
                width={900}
                height={700}
                className="h-auto w-full rounded-[1.6rem]"
              />
            </div>
          </Reveal>
        }
      >
        <Reveal>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <Headline size="md" className="mt-4">
            {c.title}
          </Headline>
          <Lede className="mt-5">{c.body}</Lede>

          <dl className="mt-10 flex flex-col">
            {c.points.map((point) => (
              <div key={point.title} className="border-t border-border py-5">
                <dt className="text-base font-semibold text-navy">{point.title}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-pretty text-muted-foreground">{point.desc}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Split>
    </Section>
  )
}
