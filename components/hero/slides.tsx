import type { Dictionary } from "@/lib/i18n"
import { SlideCourier } from "@/components/hero/slide-courier"
import { SlideAutomotive } from "@/components/hero/slide-automotive"
import { SlideClothing } from "@/components/hero/slide-clothing"
import { SlideElectronics } from "@/components/hero/slide-electronics"
import { SlideJapan } from "@/components/hero/slide-japan"

export type HeroSlide = {
  /** Stable identifier; also used as the React key. */
  id: string
  /** Short pagination label, resolved from the active dictionary. */
  label: (t: Dictionary) => string
  /** Renders the slide. Receives whether it is the visible slide. */
  render: (isActive: boolean) => React.ReactNode
}

/**
 * The homepage hero carousel, in display order.
 *
 * Adding, removing or reordering slides only requires editing this array — the
 * carousel derives its pagination, progress indicators and ARIA labelling from
 * it, so nothing else needs to change.
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "courier",
    label: (t) => t.heroCarousel.courierTab,
    render: (isActive) => <SlideCourier isActive={isActive} />,
  },
  {
    id: "automotive",
    label: (t) => t.heroCarousel.automotive.tab,
    render: (isActive) => <SlideAutomotive isActive={isActive} />,
  },
  {
    id: "clothing",
    label: (t) => t.heroCarousel.clothing.tab,
    render: (isActive) => <SlideClothing isActive={isActive} />,
  },
  {
    id: "electronics",
    label: (t) => t.heroCarousel.electronics.tab,
    render: (isActive) => <SlideElectronics isActive={isActive} />,
  },
  {
    id: "japan",
    label: (t) => t.heroCarousel.japan.tab,
    render: (isActive) => <SlideJapan isActive={isActive} />,
  },
]
