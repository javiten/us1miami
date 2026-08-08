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
