"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { CLOTHING_PRICING_ANCHOR } from "@/lib/clothing"
import { track } from "@/lib/analytics"

export function ClothingFinalCta() {
  const { t } = useI18n()
  const f = t.clothing.finalCta

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-navy px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,169,255,0.22),transparent)]" />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">{f.title}</h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-white/75">{f.body}</p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/registro"
                  onClick={() => track("clothing_final_cta_click", { cta: "create_address" })}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-10px_rgba(15,125,255,0.85)] transition-transform hover:-translate-y-0.5"
                >
                  {f.ctaPrimary}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href={`#${CLOTHING_PRICING_ANCHOR}`}
                  onClick={() => track("clothing_final_cta_click", { cta: "quote" })}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {f.ctaSecondary}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
