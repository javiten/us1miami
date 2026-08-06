/**
 * Brand lists for the marquees on /automotive and /clothing.
 *
 * IMPORTANT — legal posture: these names are shown only as examples of
 * commonly requested products. US1 Miami is not an authorized distributor and
 * displaying them implies no affiliation, authorization or sponsorship. Every
 * marquee therefore renders a visible disclaimer (see `BrandMarquee`).
 *
 * Rendering: each entry renders as a typographic wordmark by default. Supply
 * `logo` (an SVG/PNG URL) for any brand whose official asset you are licensed
 * to use and the marquee will render the image instead — no component change
 * needed. `wide` is for long names that need extra horizontal room.
 */

export type Brand = {
  /** Display name, used as the wordmark and as the image alt text. */
  name: string
  /** Optional official logo URL. Falls back to a wordmark when omitted. */
  logo?: string
  /** Set for long names so the wordmark is not cramped. */
  wide?: boolean
}

/** Automotive parts brands and suppliers. */
export const AUTOMOTIVE_BRANDS: readonly Brand[] = [
  { name: "Bosch" },
  { name: "Brembo" },
  { name: "Denso" },
  { name: "NGK" },
  { name: "Delphi" },
  { name: "ACDelco" },
  { name: "Moog" },
  { name: "Gates" },
  { name: "Continental", wide: true },
  { name: "Monroe" },
  { name: "Bilstein" },
  { name: "Sachs" },
  { name: "Mahle" },
  { name: "Mann-Filter", wide: true },
  { name: "Mobil 1" },
  { name: "Castrol" },
  { name: "Valvoline", wide: true },
  { name: "KYB" },
  { name: "Timken" },
  { name: "SKF" },
  { name: "Hella" },
  { name: "Valeo" },
]

/** Clothing, footwear and fashion-accessory brands. */
export const CLOTHING_BRANDS: readonly Brand[] = [
  { name: "Nike" },
  { name: "Adidas" },
  { name: "Puma" },
  { name: "New Balance", wide: true },
  { name: "Under Armour", wide: true },
  { name: "Converse" },
  { name: "Vans" },
  { name: "Levi's" },
  { name: "Calvin Klein", wide: true },
  { name: "Tommy Hilfiger", wide: true },
  { name: "Ralph Lauren", wide: true },
  { name: "The North Face", wide: true },
  { name: "Columbia" },
  { name: "Patagonia" },
  { name: "Carhartt" },
  { name: "Champion" },
  { name: "Reebok" },
  { name: "ASICS" },
  { name: "H&M" },
  { name: "Zara" },
]

/** Consumer-electronics manufacturers and platforms. */
export const ELECTRONICS_BRANDS: readonly Brand[] = [
  { name: "Apple" },
  { name: "Samsung" },
  { name: "Sony" },
  { name: "LG" },
  { name: "Microsoft", wide: true },
  { name: "Google" },
  { name: "Nintendo" },
  { name: "PlayStation", wide: true },
  { name: "Xbox" },
  { name: "ASUS" },
  { name: "Lenovo" },
  { name: "Dell" },
  { name: "HP" },
  { name: "Logitech" },
  { name: "JBL" },
  { name: "Bose" },
  { name: "GoPro" },
  { name: "Canon" },
  { name: "Nikon" },
  { name: "DJI" },
]
