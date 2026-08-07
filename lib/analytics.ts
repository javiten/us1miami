/**
 * Lightweight analytics abstraction.
 *
 * The project does not ship an analytics provider yet, so `track` is a thin,
 * strongly-typed seam. Events are validated and logged in development and
 * forwarded to `window.dataLayer` when a tag manager is present, which means
 * call sites never need to change once a provider is added.
 *
 * TODO(analytics): wire this to the chosen provider (Vercel Analytics
 * `track()`, GA4, Segment, PostHog…) inside `dispatch` below. Do not add a
 * provider SDK to individual components.
 */

export type AnalyticsEvent =
  | "automotive_nav_click"
  | "automotive_hero_cta_click"
  | "automotive_quote_start"
  | "automotive_quote_submit"
  | "automotive_assisted_purchase_click"
  | "automotive_create_address_click"
  | "automotive_option_cta_click"
  | "automotive_pricing_cta_click"
  | "automotive_final_cta_click"
  | "clothing_nav_click"
  | "clothing_hero_cta_click"
  | "clothing_pricing_cta_click"
  | "clothing_final_cta_click"
  | "electronics_nav_click"
  | "electronics_hero_cta_click"
  | "electronics_shipping_cta_click"
  | "electronics_final_cta_click"
  | "japan_nav_click"
  | "japan_hero_cta_click"
  | "japan_source_cta_click"
  | "japan_final_cta_click"
  | "homepage_slider_change"
  | "homepage_automotive_slide_click"
  | "homepage_clothing_slide_click"
  | "homepage_electronics_slide_click"

type AnalyticsPayload = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

function dispatch(event: AnalyticsEvent, payload: AnalyticsPayload) {
  // Forwarded to a tag manager when one is installed; harmless when absent.
  if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...payload })
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[v0] analytics:", event, payload)
  }
}

export function track(event: AnalyticsEvent, payload: AnalyticsPayload = {}) {
  // Analytics must never be able to break a user interaction.
  try {
    dispatch(event, payload)
  } catch {
    // Swallow: a failed beacon is not worth a broken CTA.
  }
}
