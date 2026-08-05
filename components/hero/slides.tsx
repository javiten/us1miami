import type { Dictionary } from "@/lib/i18n"
import { SlideCourier } from "@/components/hero/slide-courier"
import { SlideAutomotive } from "@/components/hero/slide-automotive"
import { SlideComingSoon } from "@/components/hero/slide-coming-soon"

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
    id: "coming-soon-network",
    label: (t) => t.heroCarousel.soonNetwork.tab,
    render: (isActive) => <SlideComingSoon isActive={isActive} variant="network" />,
  },
  {
    id: "coming-soon-layers",
    label: (t) => t.heroCarousel.soonLayers.tab,
    render: (isActive) => <SlideComingSoon isActive={isActive} variant="layers" />,
  },
]
