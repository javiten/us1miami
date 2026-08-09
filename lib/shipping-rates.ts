// ---------------------------------------------------------------------------
// Public shipping rate configuration + the quote engine behind /calculator.
//
// This is the single source of truth for every rate US1 Miami *advertises*.
// Administrators change a rate here and it updates the calculator, the vertical
// landing pages and the homepage together.
//
// ---------------------------------------------------------------------------
// IMPORTANT — this file is NOT the billing engine.
//
// `lib/pricing.ts` prices real consolidated shipments (RATE_TIER_1 = 49 up to
// 10 kg, RATE_TIER_2 = 47 up to 20 kg, on max(actual, volumetric) weight) and is
// consumed by invoice-actions and consolidation-actions. Those numbers appear on
// customer invoices, so editing them is a commercial decision, not a copy tweak.
//
// The two stay separate even though the entry rate currently matches:
//   - lib/pricing.ts      -> what a shipment is actually invoiced at
//   - lib/shipping-rates  -> what we quote and advertise per vertical
//
// They can legitimately diverge. The published per-vertical rates below reflect
// negotiated category pricing, while the billing engine applies the general
// consolidated-cargo tiers. Anything shown to a customer as an *estimate* comes
// from here; anything that becomes money owed comes from lib/pricing.ts. Keeping
// the split means a future marketing change cannot silently reprice invoices.
// ---------------------------------------------------------------------------

/**
 * Every advertised rate. Percentages are whole numbers (3 = 3%), rates are
 * USD per kilogram, thresholds are kilograms.
 */
export const SHIPPING_RATES = {
  /** Automotive parts, flat per-kg. */
  automotivePerKg: 49,
  /** Charged on the declared commercial value when US1 Miami buys on the customer's behalf. */
  automotiveAssistedPurchasePercent: 3,

  /** Apparel below the volume threshold. */
  clothingUnder10Kg: 55,
  /** Apparel at or above the volume threshold. */
  clothing10KgOrMore: 49,
  /** The weight at which the lower apparel rate becomes available. */
  clothingVolumeThresholdKg: 10,

  /** Electronics per-kg component. */
  electronicsPerKg: 55,
  /** Electronics commercial-value component, as a percentage of declared value. */
  electronicsCommercialValuePercent: 30,

  /**
   * General consumer goods — cosmetics, toys, phone cases, small accessories.
   * Flat per-kg, with no commercial-value component.
   *
   * Its own key rather than a reference to `clothingUnder10Kg` or
   * `electronicsPerKg`, which happen to be 55 today. They are separate
   * commercial decisions, so aliasing them would mean repricing this category
   * by accident the next time apparel or electronics moves.
   */
  consumerProductsPerKg: 55,

  /**
   * The "starting from" figure on the homepage hero.
   *
   * Deliberately its own key rather than a reference to the billing engine's
   * RATE_TIER_1. It is a marketing floor — the lowest rate reachable across all
   * verticals (automotive, and apparel at 10 kg+) — so it is lower than the
   * general courier tier a small mixed shipment is actually invoiced at.
   */
  homepageStartingRate: 49,
} as const

/** Upper input bounds. Past these, a shipment is a freight conversation, not a form. */
export const MAX_QUOTE_WEIGHT_KG = 1000
export const MAX_QUOTE_VALUE_USD = 1_000_000

/** Categories the calculator can price. `japan` is quoted manually. */
export const QUOTE_CATEGORIES = [
  "automotive",
  "clothingLight",
  "clothingHeavy",
  "electronics",
  "consumerProducts",
  "japan",
] as const

export type QuoteCategory = (typeof QUOTE_CATEGORIES)[number]

/** Categories that need the declared commercial value before they can be priced. */
export function requiresCommercialValue(category: QuoteCategory, assistedPurchase: boolean): boolean {
  if (category === "electronics") return true
  if (category === "automotive") return assistedPurchase
  return false
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

/**
 * Parse a user-typed number.
 *
 * Returns null for anything unusable — empty, NaN, Infinity, negative, zero or
 * past the cap — so a bad value can never reach the arithmetic. Accepts a comma
 * decimal separator, which is what an Argentine keyboard produces.
 */
export function parseAmount(raw: string, max: number): number | null {
  const trimmed = raw.trim().replace(",", ".")
  if (!trimmed) return null
  const n = Number(trimmed)
  if (!Number.isFinite(n) || n <= 0 || n > max) return null
  return n
}

/** A single named money row in the result breakdown. */
export type QuoteLine = { id: "shipping" | "assistedPurchase"; amount: number }

export type QuoteResult =
  /** Not enough input yet. `missing` drives which fields to flag. */
  | { status: "incomplete"; missing: Array<"weight" | "commercialValue"> }
  /** No published rate — the customer must be quoted by hand (Japan). */
  | { status: "manual" }
  | {
      status: "priced"
      total: number
      /** Present only when there is more than one component worth showing. */
      lines: QuoteLine[]
      /**
       * Set when the weight moved the customer to a different apparel tier than
       * the one they picked, so the UI can explain the switch.
       */
      appliedTier?: "clothingLight" | "clothingHeavy"
    }

/**
 * Resolve the apparel rate from the weight alone.
 *
 * The rate is a function of weight, never of which option the customer clicked.
 * Deriving it here is what makes the discount impossible to game: there is no
 * code path that reaches the 10 kg+ rate with a lighter shipment.
 */
export function resolveClothingTier(weightKg: number): {
  tier: "clothingLight" | "clothingHeavy"
  ratePerKg: number
} {
  const { clothingVolumeThresholdKg, clothing10KgOrMore, clothingUnder10Kg } = SHIPPING_RATES
  return weightKg >= clothingVolumeThresholdKg
    ? { tier: "clothingHeavy", ratePerKg: clothing10KgOrMore }
    : { tier: "clothingLight", ratePerKg: clothingUnder10Kg }
}

/**
 * Price a quote from raw form input.
 *
 * Pure and total: every branch returns a QuoteResult, and all money is rounded
 * to cents at the end so the displayed total always equals the sum of the rows.
 */
export function calculateQuote(input: {
  category: QuoteCategory
  weight: string
  commercialValue: string
  assistedPurchase: boolean
}): QuoteResult {
  const { category, assistedPurchase } = input

  // Japan has no published rate. Returning early — before any validation —
  // means the form never asks for numbers it has no use for.
  if (category === "japan") return { status: "manual" }

  const weightKg = parseAmount(input.weight, MAX_QUOTE_WEIGHT_KG)
  const needsValue = requiresCommercialValue(category, assistedPurchase)
  const value = parseAmount(input.commercialValue, MAX_QUOTE_VALUE_USD)

  const missing: Array<"weight" | "commercialValue"> = []
  if (weightKg === null) missing.push("weight")
  if (needsValue && value === null) missing.push("commercialValue")
  if (missing.length > 0) return { status: "incomplete", missing }

  // Both are non-null past this point; the guard above returned otherwise.
  const kg = weightKg as number

  if (category === "automotive") {
    const shipping = kg * SHIPPING_RATES.automotivePerKg
    if (!assistedPurchase) {
      return { status: "priced", total: round2(shipping), lines: [{ id: "shipping", amount: round2(shipping) }] }
    }
    const fee = (value as number) * (SHIPPING_RATES.automotiveAssistedPurchasePercent / 100)
    // Round each row first, then total the rounded rows. Rounding the raw sum
    // instead can print a total a cent away from what the visible rows add up
    // to, which reads as an arithmetic error on a price.
    const lines: QuoteLine[] = [
      { id: "shipping", amount: round2(shipping) },
      { id: "assistedPurchase", amount: round2(fee) },
    ]
    return {
      status: "priced",
      total: round2(lines[0].amount + lines[1].amount),
      lines,
    }
  }

  if (category === "electronics") {
    // Two components are computed and the higher one applies. This comparison is
    // deliberately invisible to the customer: the UI renders `total` only, and
    // never the losing figure or the words "whichever is greater".
    const byWeight = kg * SHIPPING_RATES.electronicsPerKg
    const byValue = (value as number) * (SHIPPING_RATES.electronicsCommercialValuePercent / 100)
    const total = round2(Math.max(byWeight, byValue))
    return { status: "priced", total, lines: [{ id: "shipping", amount: total }] }
  }

  // Consumer goods — flat per-kg, no tiering and no value component.
  //
  // This branch must stay above the apparel fallback below. That fallback treats
  // every remaining category as apparel, so without an explicit branch here a
  // 10 kg+ consumer shipment would silently pick up the apparel volume discount
  // and be quoted at 49 instead of 55.
  if (category === "consumerProducts") {
    const total = round2(kg * SHIPPING_RATES.consumerProductsPerKg)
    return { status: "priced", total, lines: [{ id: "shipping", amount: total }] }
  }

  // Apparel — the tier comes from the weight, not from the selected option.
  const { tier, ratePerKg } = resolveClothingTier(kg)
  const total = round2(kg * ratePerKg)
  return {
    status: "priced",
    total,
    lines: [{ id: "shipping", amount: total }],
    appliedTier: tier,
  }
}

/** Format a number as USD with cents. Used for every figure the calculator shows. */
export function formatUsd(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
