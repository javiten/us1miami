/**
 * Single source of truth for the US1 Miami Clothing vertical.
 *
 * Every commercial value shown on /clothing is defined here — never hard-code
 * these numbers in components. Copy in `lib/i18n-clothing.ts` interpolates
 * them so the Spanish and English pages can never quote different prices.
 */

import { SHIPPING_RATES } from "@/lib/shipping-rates"

/*
 * The three apparel figures are re-exported from the central rate config.
 * /clothing and /calculator must agree on them — a calculator that contradicts
 * the page it was linked from is worse than no calculator — so both read the
 * same values. Change them in `lib/shipping-rates.ts`.
 */

/** Standard air-freight rate for clothing shipments, USD per kg. */
export const CLOTHING_RATE_PER_KG = SHIPPING_RATES.clothingUnder10Kg

/** Discounted rate for eligible shipments at or above the volume threshold. */
export const CLOTHING_VOLUME_RATE_PER_KG = SHIPPING_RATES.clothing10KgOrMore

/** Chargeable weight, in kg, from which the volume rate can apply. */
export const CLOTHING_VOLUME_MIN_KG = SHIPPING_RATES.clothingVolumeThresholdKg

/** Estimated transit time to Argentina, in days from dispatch. */
export const CLOTHING_DELIVERY_DAYS = 7

/** Route of the Clothing landing page. */
export const CLOTHING_PATH = "/clothing"

/**
 * Anchor of the volume-pricing section. Both "quote" CTAs point here: it is
 * where the 55 vs 49 rates and the eligibility qualifiers are explained, which
 * is the actual question a visitor clicking "Cotizar envío" is asking.
 */
export const CLOTHING_PRICING_ANCHOR = "clothing-pricing"

/** Stable keys for the "what you can ship" grid; copy comes from the dictionary. */
export const CLOTHING_CATEGORY_KEYS = [
  "clothing",
  "sneakers",
  "sportswear",
  "jackets",
  "bags",
  "accessories",
  "kids",
  "outlet",
] as const

export type ClothingCategoryKey = (typeof CLOTHING_CATEGORY_KEYS)[number]
