"use client"

import Image from "next/image"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"

export function AutomotiveIntro() {
  const { t } = useI18n()
  const a = t.automotive.intro

  return (
    <section className="border-t border-border bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow={a.eyebrow} title={a.title} />
            <Reveal delay={0.06}>
              <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">{a.body}</p>
            </Reveal>

            <dl className="mt-10 flex flex-col gap-6">
              {a.highlights.map((h, i) => (
                <Reveal key={h.title} delay={0.1 + i * 0.05}>
                  <div className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary ring-4 ring-primary/15"
                    />
                    <div>
                      <dt className="text-sm font-semibold text-navy">{h.title}</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.desc}</dd>
                    </div>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>

          <Reveal delay={0.12}>
            <div className="overflow-hidden rounded-[2rem] border border-border bg-white p-2 shadow-[0_30px_70px_-40px_rgba(7,27,58,0.32)]">
              <Image
                src="/automotive-slide.png"
                alt={a.imageAlt}
                width={900}
                height={640}
                className="h-auto w-full rounded-[1.6rem]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
