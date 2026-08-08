// ---------------------------------------------------------------------------
// Shipping price engine (Miami -> Argentina consolidated air cargo).
//
// The price is derived from the final consolidated BILLABLE weight in kilograms
// where billable = max(actual weight, volumetric weight). Rates are fixed and
// can never be edited by a customer or operator — every invoice runs through
// this single function so the numbers are always reproducible.
//
//   Up to 10 kg .............. USD 49 / kg
//   > 10 kg and up to 20 kg .. USD 47 / kg
//   > 20 kg .................. blocked -> manual review (no auto checkout)
//
// These rates were lowered from 55/53 to 49/47. Tier 2 had to move together with
// tier 1: the tiers exist so that heavier shipments earn a better per-kg rate, so
// dropping only tier 1 to 49 would have made 10.1 kg (at 53) cost more in total
// than 10 kg (at 49) — a ~USD 45 cliff for 100 g, turning the volume discount
// into a volume penalty. Keeping a 2/kg gap preserves the original intent.
//
// Not retroactive: invoice rows persist their own ratePerKg and subtotal at the
// time of pricing, so shipments already priced keep the rate they were quoted.
// Only new pricing runs and explicit recalcs pick these up.
// ---------------------------------------------------------------------------

export const LB_TO_KG = 0.45359237

// IATA volumetric factor: 6000 cm³ per kg. Dimensions are stored in inches, so
// we convert in³ -> cm³ (1 in³ = 16.387064 cm³) and divide by 6000, which is
// equivalent to dividing the inch-volume by ~366.14.
export const VOLUMETRIC_DIVISOR_IN3_PER_KG = 6000 / 16.387064 // ≈ 366.14

export const MAX_AUTO_KG = 20
export const TIER_1_MAX_KG = 10
export const RATE_TIER_1 = 49 // USD/kg, up to 10 kg
export const RATE_TIER_2 = 47 // USD/kg, > 10 kg and <= 20 kg

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

function round3(n: number): number {
  return Math.round((n + Number.EPSILON) * 1000) / 1000
}

/** Fixed per-kg rate for a billable weight, or null when manual review is required. */
export function rateForBillableKg(billableKg: number): number | null {
  if (billableKg <= 0) return null
  if (billableKg <= TIER_1_MAX_KG) return RATE_TIER_1
  if (billableKg <= MAX_AUTO_KG) return RATE_TIER_2
  return null // > 20 kg -> requires review
}

export type PricingBreakdown = {
  actualWeightKg: number
  volumetricWeightKg: number
  billableWeightKg: number
  ratePerKg: number | null
  subtotal: number | null
  requiresReview: boolean
}

/**
 * Compute the full pricing breakdown from the consolidated shipment
 * measurements. Weight is provided in pounds and dimensions in inches to match
 * how they are captured at the warehouse.
 */
export function computeCwrPricing(input: {
  weightLb: number
  lengthIn?: number | null
  widthIn?: number | null
  heightIn?: number | null
}): PricingBreakdown {
  const actualWeightKg = round3(Math.max(0, input.weightLb) * LB_TO_KG)

  const l = Number(input.lengthIn) || 0
  const w = Number(input.widthIn) || 0
  const h = Number(input.heightIn) || 0
  const volumetricWeightKg =
    l > 0 && w > 0 && h > 0 ? round3((l * w * h) / VOLUMETRIC_DIVISOR_IN3_PER_KG) : 0

  const billableWeightKg = round3(Math.max(actualWeightKg, volumetricWeightKg))
  return priceByBillableKg(billableWeightKg, { actualWeightKg, volumetricWeightKg })
}

/** Price directly from a known billable weight (kg). Used by the recalc flow. */
export function priceByBillableKg(
  billableWeightKg: number,
  extra?: { actualWeightKg?: number; volumetricWeightKg?: number },
): PricingBreakdown {
  const billable = round3(Math.max(0, billableWeightKg))
  const ratePerKg = rateForBillableKg(billable)
  const requiresReview = ratePerKg === null
  return {
    actualWeightKg: round3(extra?.actualWeightKg ?? billable),
    volumetricWeightKg: round3(extra?.volumetricWeightKg ?? 0),
    billableWeightKg: billable,
    ratePerKg,
    subtotal: ratePerKg === null ? null : round2(billable * ratePerKg),
    requiresReview,
  }
}
