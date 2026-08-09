/**
 * Route config for /calculator.
 *
 * Mirrors `lib/automotive.ts`, `lib/clothing.ts` etc. so the path and anchors
 * are imported rather than typed as string literals in the header, the sitemap
 * and the cross-links from the vertical pages.
 *
 * Note there are no rates here — every figure the calculator uses comes from
 * `SHIPPING_RATES` in `lib/shipping-rates.ts`, which is the one place an
 * administrator edits pricing.
 */

export const CALCULATOR_PATH = "/calculator"

/** The calculator widget itself, for deep links from the verticals. */
export const CALCULATOR_ANCHOR = "calculator"

/**
 * What the WhatsApp handoff message is allowed to mention.
 *
 * Every field except `categoryLabel` is optional, and each locale's template
 * writes a line only when its field is present. That is the whole mechanism for
 * the per-category rules: instead of five branches of copy, the caller decides
 * what is *relevant* and omits the rest, so a value can never reach the message
 * as `undefined`, `NaN` or an empty string — the line simply is not written.
 *
 * Amounts stay numbers rather than pre-formatted strings so the locale template
 * owns currency formatting, and no caller can send a bare `55` where
 * `USD $55.00` belongs.
 */
export type WhatsappQuoteDetails = {
  categoryLabel: string
  /**
   * Normalised decimal — `"2.5"` even when typed as `"2,5"`. Absent for Japan,
   * whose panel never shows a weight field.
   */
  weight?: string
  /** Published per-kg rate for the tier actually applied. Apparel and consumer goods only. */
  rate?: string
  commercialValue?: number
  /** Automotive only — no other category asks the assisted-purchase question. */
  assisted?: boolean
  assistedFee?: number
  /**
   * Set only when shipping is a genuinely separate row from the total. When
   * shipping *is* the total, restating it directly above the total reads like a
   * duplicated charge.
   */
  shipping?: number
  total?: number
}
