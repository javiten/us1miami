/**
 * Japan vertical configuration.
 *
 * IMPORTANT — pricing posture: this vertical deliberately publishes NO
 * per-kilogram rate. The rate defined in `lib/electronics.ts` and
 * `lib/clothing.ts` covers a Miami -> Argentina leg; a Japan sourcing request
 * additionally involves a Japanese purchase, domestic Japanese shipping and an
 * extra international leg, so reusing that figure here would understate the
 * real cost. Every price statement on /japan is therefore an explicit
 * "custom quote", and the totals are confirmed with the customer before any
 * purchase is attempted.
 *
 * Because there is no rate and no committed transit time, there is also no
 * numeric constant to interpolate into the copy — unlike the other verticals.
 * What lives here instead is the *structure* of the page: the ids that pair
 * each card with its translated copy and its icon.
 */

export const JAPAN_PATH = "/japan"

/**
 * Anchor for the "how it works" section, used by the hero's secondary CTA.
 */
export const JAPAN_HOW_ANCHOR = "japan-how"

/**
 * Anchor for the request section that both closing CTAs point at.
 *
 * There is no Japan-specific intake form in the project yet, so the "request a
 * purchase" CTAs land on the assisted-buying explanation: it is where the
 * eligibility requirements and the cost-confirmation step are disclosed, which
 * is the actual question behind the click.
 */
export const JAPAN_REQUEST_ANCHOR = "japan-assisted"

/**
 * The three legs of the route visual shown in the hero.
 *
 * Japan is the sourcing origin, Miami is the consolidation hub and Argentina is
 * the destination. Keeping this as data means the hero and the structured data
 * describe the same path.
 */
export const JAPAN_ROUTE = ["japan", "miami", "argentina"] as const

export type JapanRouteLeg = (typeof JAPAN_ROUTE)[number]

/**
 * Product categories for the "what you can find" grid.
 *
 * Order is intentional: retro gaming and collectibles lead because they are the
 * categories Japan is uniquely good for, which is the reason to use this
 * service over a domestic purchase.
 */
export const JAPAN_CATEGORY_IDS = [
  "retroConsoles",
  "videoGames",
  "controllers",
  "figures",
  "plush",
  "tradingCards",
  "modelKits",
  "animeMerch",
  "vintageAudio",
  "retroElectronics",
  "cameras",
  "rareCollectibles",
] as const

export type JapanCategoryId = (typeof JAPAN_CATEGORY_IDS)[number]

/**
 * Featured Japanese sourcing platforms explained in their own cards.
 *
 * These are described as examples of where we can look on a customer's behalf.
 * No card asserts a partnership, and the section renders the same
 * non-affiliation disclaimer as the marketplace roller.
 */
export const JAPAN_SOURCE_IDS = [
  "yahooAuctions",
  "mercari",
  "amazonJapan",
  "hardOff",
  "hobbyOff",
  "offHouse",
  "bookOff",
  "surugayaMandarake",
] as const

export type JapanSourceId = (typeof JAPAN_SOURCE_IDS)[number]

/** The six steps of an assisted Japanese purchase, in order. */
export const JAPAN_STEP_IDS = ["request", "review", "approve", "purchase", "prepare", "deliver"] as const

export type JapanStepId = (typeof JAPAN_STEP_IDS)[number]

/**
 * The barriers that make a Japanese purchase hard without assistance.
 *
 * This list is the argument for the service: each item is something a buyer in
 * Argentina generally cannot satisfy on their own.
 */
export const JAPAN_BARRIER_IDS = [
  "japaneseAccount",
  "localAddress",
  "paymentMethods",
  "sellerComms",
  "bidding",
  "domesticShipping",
] as const

export type JapanBarrierId = (typeof JAPAN_BARRIER_IDS)[number]

/**
 * Conditions that must be disclosed before a customer commits.
 *
 * Auction finality and used-condition wear are the two that most often cause
 * disputes, so they lead.
 */
export const JAPAN_CONDITION_IDS = [
  "auctionsFinal",
  "usedWear",
  "sellerDescription",
  "restricted",
  "customs",
  "timing",
  "noWarranty",
] as const

export type JapanConditionId = (typeof JAPAN_CONDITION_IDS)[number]
