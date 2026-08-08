"use client"

import { WhatsAppIcon } from "@/components/brand-icons"
import { useI18n } from "@/components/language-provider"
import { WHATSAPP_URL } from "@/lib/constants"
import { track } from "@/lib/analytics"

/**
 * Persistent WhatsApp contact action, fixed to the bottom-right of the
 * marketing pages.
 *
 * Placement notes:
 * - The marketing site has no other fixed bottom-anchored UI (no cookie bar, no
 *   sticky mobile CTA), so bottom-right is free. It is offset from both edges
 *   and respects `env(safe-area-inset-*)` so it clears the iOS home indicator.
 * - Icon-only with an `aria-label`, plus a label that expands on pointer hover
 *   and focus. The expanding label sits on navy, not on the green, so its text
 *   contrast is unaffected by the brand colour.
 * - Rendered inside the marketing shells only, never over the customer portal
 *   or admin, where it would sit on top of real working UI.
 */
export function FloatingWhatsApp() {
  const { t } = useI18n()

  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-40 p-4 sm:p-6">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.social.whatsappLabel}
        onClick={() => track("whatsapp_click", { source: "floating" })}
        style={{
          marginBottom: "env(safe-area-inset-bottom)",
          marginRight: "env(safe-area-inset-right)",
        }}
        className="group pointer-events-auto flex h-14 w-14 items-center justify-center gap-0 rounded-full bg-whatsapp text-white shadow-lg shadow-navy/25 outline-none transition-[width,background-color,box-shadow] duration-300 hover:w-14 hover:bg-whatsapp-hover focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 sm:hover:w-auto sm:hover:gap-2.5 sm:hover:px-5 sm:focus-visible:w-auto sm:focus-visible:gap-2.5 sm:focus-visible:px-5"
      >
        <WhatsAppIcon className="h-7 w-7 shrink-0" />
        {/* Expands only from `sm` up: on touch there is no hover state to
            reveal it, and a permanently wide pill covers more of the page. */}
        <span className="hidden whitespace-nowrap text-sm font-semibold sm:max-w-0 sm:overflow-hidden sm:opacity-0 sm:transition-all sm:duration-300 sm:group-hover:max-w-[12rem] sm:group-hover:opacity-100 sm:group-focus-visible:max-w-[12rem] sm:group-focus-visible:opacity-100 sm:inline-block">
          {t.social.whatsappShort}
        </span>
      </a>
    </div>
  )
}
