"use client"

import { motion } from "motion/react"
import { ArrowRight, Phone, Mail } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"

export function FinalCta() {
  const { t } = useI18n()
  return (
    <section id="quote" className="px-4 py-20 sm:px-6 sm:py-28">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-navy px-8 py-16 text-center shadow-[0_50px_100px_-50px_rgba(15,125,255,0.7)] sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(37,169,255,0.35),transparent)]" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(37,169,255,0.28),transparent)]" />

          <h2 className="relative mx-auto max-w-2xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {t.finalCta.title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-pretty text-lg text-white/80">
            {t.finalCta.description}
          </p>

          <motion.a
            href="#quote"
            whileHover={{ y: -2 }}
            className="relative mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-navy shadow-lg"
          >
            {t.finalCta.cta}
            <ArrowRight className="h-4 w-4" />
          </motion.a>

          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <a
              href="tel:+13059679756"
              className="flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              <Phone className="h-4 w-4 text-sky" />
              {"(305) 967-9756"}
            </a>
            <a
              href="mailto:info@us1trade.com"
              className="flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 text-sky" />
              info@us1trade.com
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
