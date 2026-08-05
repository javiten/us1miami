"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

export const slideEase = [0.21, 0.47, 0.32, 0.98] as const

/**
 * Shared entrance choreography for hero slides. Every slide uses the same
 * container/item variant pair so the four slides feel like one system, and the
 * whole sequence collapses to a plain fade when the visitor prefers reduced
 * motion.
 */
export function useSlideMotion() {
  const reduced = useReducedMotion()

  const container = {
    hide: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.07, delayChildren: reduced ? 0 : 0.12 },
    },
  }

  const item = {
    hide: { opacity: 0, y: reduced ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.2 : 0.55, ease: slideEase },
    },
  }

  const visual = {
    hide: { opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reduced ? 0.2 : 0.8, ease: slideEase },
    },
  }

  return { container, item, visual }
}

/**
 * Every slide shares this two-column shell. Using one identical structure is
 * what keeps the carousel height stable — slides are stacked in a single CSS
 * grid cell, so the tallest one defines the height and nothing shifts when the
 * active slide changes.
 */
export function SlideFrame({
  isActive,
  content,
  visual,
}: {
  isActive: boolean
  content: ReactNode
  visual: ReactNode
}) {
  const { container } = useSlideMotion()

  return (
    <motion.div
      variants={container}
      initial="hide"
      animate={isActive ? "show" : "hide"}
      // Top padding clears the fixed site header; the deeper bottom padding
      // (vs. the old standalone hero) leaves room for the carousel controls.
      className="pt-32 pb-32 sm:pt-40 sm:pb-36"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8">
        <div className="min-w-0">{content}</div>
        <div className="relative min-w-0">{visual}</div>
      </div>
    </motion.div>
  )
}
