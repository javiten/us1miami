"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { Reveal } from "@/components/reveal"
import { CONTAINER, Eyebrow, HERO_HEADLINE, Lede } from "@/components/editorial/primitives"

/**
 * /calculator hero.
 *
 * Deliberately shorter than the vertical-landing heroes: this page's job is the
 * widget below, so the hero states what the page does and gets out of the way
 * instead of carrying CTAs that compete with the form.
 */
export function CalculatorHero() {
  const { t } = useI18n()
  const c = t.calculator

  return (
    <section className="relative overflow-hidden border-b border-border bg-muted/40 pt-28 pb-14 sm:pt-32 sm:pb-16">
      <div className={CONTAINER}>
        {/* Breadcrumb, since /calculator is reachable from every page's nav and
            benefits from an explicit way back. */}
        <Reveal>
          <nav aria-label={c.meta.breadcrumb} className="mb-8">
            <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-navy">
                  {c.meta.home}
                </Link>
              </li>
              <li aria-hidden className="flex items-center">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li aria-current="page" className="font-medium text-navy">
                {c.meta.breadcrumb}
              </li>
            </ol>
          </nav>
        </Reveal>

        <div className="max-w-3xl">
          <Reveal delay={0.05}>
            <Eyebrow>{c.hero.eyebrow}</Eyebrow>
            <h1 className={`mt-6 ${HERO_HEADLINE}`}>{c.hero.title}</h1>
            <Lede className="mt-6">{c.hero.body}</Lede>
            <p className="mt-4 text-sm text-muted-foreground">{c.hero.note}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
