"use client"

import { motion } from "motion/react"
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

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </Tag>
  )
}
