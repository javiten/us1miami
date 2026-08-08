"use client"

import { VerticalFinalCta } from "@/components/verticals/vertical-final-cta"
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
 *
 * The drafting-grid texture is this vertical's signature material, and is the
 * one thing it varies from the shared closing panel.
 */
export function JapanFinalCta() {
  const { t } = useI18n()
  const f = t.japan.finalCta

  return (
    <VerticalFinalCta
      title={f.title}
      body={f.body}
      texture={<div className="us1-japan-grid-inverse absolute inset-0 opacity-70" />}
      primary={{
        href: `#${JAPAN_REQUEST_ANCHOR}`,
        label: f.ctaPrimary,
        onSelect: () => track("japan_final_cta_click", { cta: "send_link" }),
      }}
      secondary={{
        href: "/registro",
        label: f.ctaSecondary,
        onSelect: () => track("japan_final_cta_click", { cta: "request_search" }),
      }}
    />
  )
}
