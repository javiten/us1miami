"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { AUTOMOTIVE_QUOTE_ANCHOR } from "@/lib/automotive"
import { track } from "@/lib/analytics"

export function AutomotiveFinalCta() {
  const { t } = useI18n()
  const a = t.automotive.finalCta

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-navy px-6 py-16 text-center text-white sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,169,255,0.22),transparent)]" />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-sky">{a.eyebrow}</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{a.title}</h2>
              <p className="mt-5 text-pretty leading-relaxed text-white/70">{a.description}</p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={`#${AUTOMOTIVE_QUOTE_ANCHOR}`}
                  onClick={() => track("automotive_final_cta_click", { cta: "quote" })}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
                >
                  {a.primaryCta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <Link
                  href="/#warehouse"
                  onClick={() => track("automotive_final_cta_click", { cta: "address" })}
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {a.secondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
