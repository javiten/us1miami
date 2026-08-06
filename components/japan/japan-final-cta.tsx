"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { JAPAN_REQUEST_ANCHOR } from "@/lib/japan"
import { track } from "@/lib/analytics"

/**
 * Closing CTA for /japan.
 *
 * Both actions are framed as starting a conversation ("send a link", "request a
 * search") rather than buying, because nothing is purchased until the customer
 * approves a quote. The body copy restates the cost-confirmation promise so the
 * commitment is unambiguous at the point of conversion.
 */
export function JapanFinalCta() {
  const { t } = useI18n()
  const f = t.japan.finalCta

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-navy px-6 py-14 text-center sm:px-12">
            {/* Decorative only: the grid reads as drafting paper and the glow
                lifts the headline off the navy panel. */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="us1-japan-grid-inverse absolute inset-0 opacity-70" />
              <div className="absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,16,46,0.2),transparent)]" />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">{f.title}</h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-white/75">{f.body}</p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={`#${JAPAN_REQUEST_ANCHOR}`}
                  onClick={() => track("japan_final_cta_click", { cta: "send_link" })}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-10px_rgba(15,125,255,0.85)] transition-transform hover:-translate-y-0.5"
                >
                  {f.ctaPrimary}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <Link
                  href="/registro"
                  onClick={() => track("japan_final_cta_click", { cta: "request_search" })}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {f.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
