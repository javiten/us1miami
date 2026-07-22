"use client"

import { motion } from "motion/react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"

const stores = [
  "Amazon",
  "eBay",
  "AliExpress",
  "Alibaba",
  "Rakuten",
  "Yahoo! Japan",
  "B&H",
  "Best Buy",
  "Newegg",
  "Apple",
  "Nike",
  "Adidas",
  "Temu",
]

function Marquee({ reverse = false }: { reverse?: boolean }) {
  const items = [...stores, ...stores]
  return (
    <div className="group relative flex overflow-hidden">
      <motion.div
        className="flex shrink-0 items-center gap-3 pr-3"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 38, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
      >
        {items.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="flex items-center whitespace-nowrap rounded-2xl border border-border bg-white px-6 py-3.5 text-lg font-semibold tracking-tight text-navy/80 shadow-sm"
          >
            {s}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function Destinations() {
  const { t } = useI18n()
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">{t.destinations.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            {t.destinations.title}
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">{t.destinations.subtitle}</p>
        </Reveal>
      </div>

      <div className="relative mt-14 flex flex-col gap-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent sm:w-40" />
        <Marquee />
        <Marquee reverse />
      </div>
    </section>
  )
}
