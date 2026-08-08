/**
 * Single source of truth for the US1 Miami Automotive vertical.
 *
 * Every commercial value shown on /automotive and on the homepage automotive
 * slide is defined here. Never hard-code these numbers in components.
 *
 * Note: the general courier rate lives in `lib/pricing.ts` and is intentionally
 * separate — Automotive is its own vertical with its own starting rate.
 */

import { SHIPPING_RATES } from "@/lib/shipping-rates"

/**
 * Starting air-freight rate for eligible automotive shipments, USD per kg.
 *
 * Re-exported from the central rate config so /automotive, the homepage slide
 * and /calculator can never quote different numbers. Change the value in
 * `lib/shipping-rates.ts`.
 */
export const AUTOMOTIVE_RATE_PER_KG = SHIPPING_RATES.automotivePerKg

/** Fee charged when US1 Miami buys the part on the customer's behalf, in percent. */
export const ASSISTED_PURCHASE_FEE_PCT = SHIPPING_RATES.automotiveAssistedPurchasePercent

/** Homepage hero carousel auto-advance interval, in milliseconds. */
export const HERO_CAROUSEL_INTERVAL_MS = 7000

/** Slide cross-fade duration, in milliseconds (brief: 600–900ms). */
export const HERO_CAROUSEL_TRANSITION_MS = 700

/** Route of the Automotive landing page. */
export const AUTOMOTIVE_PATH = "/automotive"

/** Anchor of the automotive quote form. */
export const AUTOMOTIVE_QUOTE_ANCHOR = "quote"

/* ------------------------------------------------------------------ */
/* Quote form constraints — shared by the client form and the server   */
/* action so validation can never drift between the two.               */
/* ------------------------------------------------------------------ */

export const VIN_LENGTH = 17

export const QUOTE_MAX_FILES = 5

/** Maximum size per uploaded attachment, in bytes. */
export const QUOTE_MAX_FILE_BYTES = 8 * 1024 * 1024

export const QUOTE_ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
] as const

/** `accept` attribute value for the file input. */
export const QUOTE_FILE_ACCEPT = ".jpg,.jpeg,.png,.webp,.heic,.pdf"

export const PURCHASE_METHODS = ["SELF", "ASSISTED", "UNDECIDED"] as const
export type PurchaseMethod = (typeof PURCHASE_METHODS)[number]

export function isPurchaseMethod(value: unknown): value is PurchaseMethod {
  return PURCHASE_METHODS.includes(value as PurchaseMethod)
}

/** Stable keys for the parts-category grid; copy comes from the dictionary. */
export const PART_CATEGORY_KEYS = [
  "engine",
  "brakes",
  "suspension",
  "sensors",
  "transmission",
  "filters",
  "lighting",
  "airConditioning",
  "accessories",
  "specialty",
  "partNumber",
  "vinSpecific",
] as const

export type PartCategoryKey = (typeof PART_CATEGORY_KEYS)[number]
