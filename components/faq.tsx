"use client"

import { useId, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Plus } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useI18n } from "@/components/language-provider"
import { Eyebrow, Headline, Section } from "@/components/editorial/primitives"

/**
 * Slot 10 — FAQ.
 *
 * Content is unchanged; only the shape is. It moves from a centred column of
 * bordered cards to an asymmetric editorial layout: a sticky heading on the
 * left and hairline-separated rows on the right. Losing the per-item card
 * borders is what stops this section reading as yet another card grid.
 *
 * Accessibility: each row is a real <button> that owns `aria-expanded` and
 * `aria-controls`, and the panel is only removed from the DOM after its exit
 * animation, so the control/panel relationship stays valid while open.
 */
export function Faq() {
  const { t } = useI18n()
  const baseId = useId()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section id="faq" tone="muted" space="normal" aria-labelledby="faq-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <Eyebrow>{t.faq.eyebrow}</Eyebrow>
            <Headline id="faq-title" size="md" className="mt-4">
              {t.faq.title}
            </Headline>
          </div>
        </Reveal>

        <div className="border-t border-navy/15">
          {t.faq.items.map((f, i) => {
            const isOpen = open === i
            const panelId = `${baseId}-panel-${i}`
            const buttonId = `${baseId}-button-${i}`

            return (
              <div key={f.q} className="border-b border-navy/15">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-primary"
                  >
                    <span className="text-base font-semibold text-navy">{f.q}</span>
                    <motion.span
                      aria-hidden
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-navy/20 text-primary"
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.5} />
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 pr-14 text-sm leading-relaxed text-pretty text-muted-foreground">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
