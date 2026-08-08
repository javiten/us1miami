"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

/**
 * `as` exists so this can be a list item.
 *
 * Wrapping an `<li>` in the default `motion.div` produces `ul > div > li`, which
 * is invalid: assistive tech may then fail to announce the list or its item
 * count. Passing `as="li"` makes the animated element itself the list item, so
 * the wrapper never breaks the `ul`/`li` relationship.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  as = "div",
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  as?: "div" | "li"
  className?: string
}) {
  const Tag = as === "li" ? motion.li : motion.div

  // These transforms are driven by JS, so the `prefers-reduced-motion` block in
  // globals.css cannot switch them off the way it does the CSS marquee. Since
  // Reveal wraps most content on the site, it is the largest source of motion
  // here — so it has to opt out itself. Reduced motion keeps the fade (opacity
  // alone does not induce vestibular symptoms) and drops the travel.
  const reduced = useReducedMotion()

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduced ? 0.2 : 0.6, delay: reduced ? 0 : delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </Tag>
  )
}
