"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { Eyebrow, Headline, Lede } from "@/components/editorial/primitives"

export type VerticalCtaAction = {
  href: string
  label: string
  /** Fired on click. Each vertical passes its own namespaced analytics event. */
  onSelect?: () => void
}

/**
 * The closing navy panel shared by the four vertical landing pages.
 *
 * /automotive, /clothing, /electronics and /japan each had their own copy of
 * this: same navy panel, same centred heading, same primary + ghost button
 * pair, differing only in corner radius, button colour and which decorative
 * glow sat behind it. Four files drifting apart is how the heading here ended
 * up in bold sans while the rest of the redesign moved to the display serif.
 *
 * Rendered as one component so the panel can only look one way. The heading now
 * comes from the shared editorial primitives, matching every other section
 * title on the site.
 *
 * `texture` is the one intentional variation: /japan layers its drafting-grid
 * pattern here, which is that vertical's signature material rather than filler.
 */
export function VerticalFinalCta({
  eyebrow,
  title,
  body,
  primary,
  secondary,
  texture,
}: {
  /** Optional — only /automotive labels its closing panel. */
  eyebrow?: string
  title: string
  body: string
  primary: VerticalCtaAction
  secondary: VerticalCtaAction
  texture?: ReactNode
}) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-navy px-6 py-16 text-center sm:px-12 sm:py-20">
            {texture ? (
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                {texture}
              </div>
            ) : null}

            <div className="relative mx-auto max-w-2xl">
              {eyebrow ? <Eyebrow tone="light">{eyebrow}</Eyebrow> : null}
              <Headline size="md" tone="light" className={eyebrow ? "mt-4" : undefined}>
                {title}
              </Headline>
              <Lede tone="light" className="mt-5">
                {body}
              </Lede>

              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <CtaButton action={primary} variant="primary" />
                <CtaButton action={secondary} variant="ghost" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/**
 * In-page jumps must stay plain anchors — routing a "#quote" href through
 * `next/link` would push a history entry instead of scrolling. Anything else is
 * a real navigation and goes through the router.
 */
function CtaButton({ action, variant }: { action: VerticalCtaAction; variant: "primary" | "ghost" }) {
  const className =
    variant === "primary"
      ? "group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
      : "inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"

  const content =
    variant === "primary" ? (
      <>
        {action.label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </>
    ) : (
      action.label
    )

  if (action.href.startsWith("#")) {
    return (
      <a href={action.href} onClick={action.onSelect} className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link href={action.href} onClick={action.onSelect} className={className}>
      {content}
    </Link>
  )
}
