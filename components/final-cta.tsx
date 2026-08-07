"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Phone, Mail } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { COMPANY } from "@/lib/constants"
import { CONTAINER, Headline } from "@/components/editorial/primitives"

/**
 * Slot 11 — full-width closing CTA.
 *
 * Was a rounded gradient card with two decorative radial blobs. It is now
 * edge-to-edge with a real photograph behind a navy scrim, which closes the
 * page at the same scale as the full-bleed warehouse band and drops the
 * gradient-blob decoration entirely.
 */
export function FinalCta() {
  const { t } = useI18n()

  return (
    <section id="quote" aria-labelledby="final-cta-title" className="relative isolate overflow-hidden bg-navy">
      <Image
        src="/home-cta.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-navy/80" />

      <div className={`${CONTAINER} py-24 text-center md:py-32`}>
        <Reveal>
          <Headline id="final-cta-title" size="xl" tone="light" className="mx-auto max-w-3xl">
            {t.finalCta.title}
          </Headline>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-pretty text-white/75 md:text-lg">
            {t.finalCta.description}
          </p>

          <Link
            href="/registro"
            className="group mt-10 inline-flex items-center gap-2 rounded-md bg-white px-8 py-4 text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
          >
            {t.finalCta.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="mt-14 flex flex-col items-center justify-center gap-4 border-t border-white/15 pt-10 sm:flex-row sm:gap-10">
            <a
              href={`tel:+${COMPANY.whatsapp}`}
              className="flex items-center gap-2 text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              <Phone className="h-4 w-4 text-sky" />
              {COMPANY.phone}
            </a>
            <a
              href={`mailto:${COMPANY.email}`}
              className="flex items-center gap-2 text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 text-sky" />
              {COMPANY.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
