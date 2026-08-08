/**
 * Electronics vertical configuration.
 *
 * Every commercial figure shown on /electronics is defined here once and
 * interpolated into both language dictionaries, so a rate change never has to
 * be chased through prose in two languages plus the structured data.
 *
 * Unlike the clothing vertical, electronics has a SINGLE rate. There is no
 * discounted volume tier, so the rate is always presented as a starting
 * ("from") price whose final value depends on actual or volumetric weight.
 */

import { SHIPPING_RATES } from "@/lib/shipping-rates"

export const ELECTRONICS_PATH = "/electronics"

/**
 * Anchor for the handling-notices section.
 *
 * Electronics has no volume-pricing block to deep-link to, so the "quote" CTAs
 * point here instead: it is where the weight rules, battery review and
 * individual-quote conditions are disclosed.
 */
export const ELECTRONICS_NOTICE_ANCHOR = "electronics-notice"

/**
 * Starting shipping rate in USD per kilogram. Always phrased as "from".
 *
 * Re-exported from the central rate config, which /calculator also reads. Note
 * that the calculator additionally applies a commercial-value component for this
 * vertical; this per-kg figure is only the weight side of that calculation.
 */
export const ELECTRONICS_RATE_PER_KG = SHIPPING_RATES.electronicsPerKg

/** Estimated transit time in days, counted from dispatch — not from purchase. */
export const ELECTRONICS_TRANSIT_DAYS = 7

/** Currency code used for display and for Schema.org offers. */
export const ELECTRONICS_CURRENCY = "USD"

/**
 * The category cards rendered in the "Popular categories" grid.
 *
 * Order is intentional: the highest-demand categories lead. Each id maps to a
 * copy entry in the dictionaries and to a Lucide icon in the grid component,
 * which keeps the icon choice next to the markup that renders it.
 */
export const ELECTRONICS_CATEGORY_IDS = [
  "smartphones",
  "computers",
  "consoles",
  "audio",
  "cameras",
  "smartwatches",
  "accessories",
  "smartHome",
  "smallElectronics",
  "replacements",
] as const

export type ElectronicsCategoryId = (typeof ELECTRONICS_CATEGORY_IDS)[number]

/** The six fulfilment steps, in order. */
export const ELECTRONICS_STEP_IDS = ["purchase", "send", "receive", "verify", "prepare", "deliver"] as const

export type ElectronicsStepId = (typeof ELECTRONICS_STEP_IDS)[number]

/** The handling and liability points that must be disclosed before purchase. */
export const ELECTRONICS_NOTICE_IDS = [
  "batteries",
  "restrictions",
  "oversized",
  "weight",
  "warranty",
  "notSeller",
] as const

export type ElectronicsNoticeId = (typeof ELECTRONICS_NOTICE_IDS)[number]
