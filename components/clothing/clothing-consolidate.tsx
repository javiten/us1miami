"use client"

import Image from "next/image"

import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"

export function ClothingConsolidate() {
  const { t } = useI18n()
  const c = t.clothing.consolidate

  return (
    <section id="clothing-consolidate" className="border-y border-border bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-strong">{c.eyebrow}</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              {c.title}
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{c.body}</p>

            <dl className="mt-8 flex flex-col gap-5">
              {c.points.map((point) => (
                <div key={point.title} className="border-l-2 border-primary/30 pl-4">
                  <dt className="text-base font-semibold text-navy">{point.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{point.desc}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-[2rem] border border-border bg-background p-2 shadow-[0_30px_60px_-35px_rgba(7,27,58,0.3)]">
              <Image
                src="/images/clothing-consolidate.png"
                alt={c.imageAlt}
                width={900}
                height={700}
                className="h-auto w-full rounded-[1.6rem]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
