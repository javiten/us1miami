"use client"

import { VerticalFinalCta } from "@/components/verticals/vertical-final-cta"
import { useI18n } from "@/components/language-provider"
import { AUTOMOTIVE_QUOTE_ANCHOR } from "@/lib/automotive"
import { track } from "@/lib/analytics"

export function AutomotiveFinalCta() {
  const { t } = useI18n()
  const a = t.automotive.finalCta

  return (
    <VerticalFinalCta
      eyebrow={a.eyebrow}
      title={a.title}
      body={a.description}
      primary={{
        href: `#${AUTOMOTIVE_QUOTE_ANCHOR}`,
        label: a.primaryCta,
        onSelect: () => track("automotive_final_cta_click", { cta: "quote" }),
      }}
      secondary={{
        href: "/#warehouse",
        label: a.secondaryCta,
        onSelect: () => track("automotive_final_cta_click", { cta: "address" }),
      }}
    />
  )
}
