"use client"

import Image from "next/image"
import { ShieldCheck, Clock, MapPin } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { Eyebrow, FullBleed, Headline, Lede } from "@/components/editorial/primitives"

const icons = [ShieldCheck, Clock, MapPin]

/**
 * Slot 5 — full-bleed photograph.
 *
 * This is the page's one edge-to-edge dark moment. Previously it was a
 * side-by-side of prose and a framed screenshot-style image, which is the same
 * shape as the section above it; letting the photograph run full width gives
 * the page a change of scale instead of another two-column block.
 *
 * The navy scrim in `FullBleed` is what keeps the white text legible over an
 * arbitrary photograph, so the copy sits in the darker left third on desktop.
 */
export function WarehouseSection() {
  const { t } = useI18n()
  const points = t.warehouse.points.map((label, i) => ({ label, icon: icons[i] }))

  return (
    <section id="warehouse" aria-labelledby="warehouse-title">
      <FullBleed
        minHeight="tall"
        overlay="strong"
        image={
          <Image
            src="/home-warehouse.png"
            alt={t.warehouse.imageAlt}
            fill
            sizes="100vw"
            className="object-cover object-[70%_center]"
          />
        }
      >
        <Reveal className="max-w-xl">
          <Eyebrow tone="light">{t.warehouse.eyebrow}</Eyebrow>
          <Headline id="warehouse-title" size="lg" tone="light" className="mt-4">
            {t.warehouse.title}
          </Headline>
          <Lede tone="light" className="mt-6">
            {t.warehouse.description}
          </Lede>

          <ul className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-8">
            {points.map((p) => (
              <li key={p.label} className="flex items-center gap-3">
                <p.icon className="h-5 w-5 shrink-0 text-sky" strokeWidth={2.2} />
                <span className="text-sm font-medium text-white/90">{p.label}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-xs uppercase tracking-[0.18em] text-white/55">
            {t.warehouse.overlayLabel} — {t.warehouse.overlayValue}
          </p>
        </Reveal>
      </FullBleed>
    </section>
  )
}
