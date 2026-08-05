"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Plus } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { useI18n } from "@/components/language-provider"
import { cn } from "@/lib/utils"

export function AutomotiveFaq() {
  const { t } = useI18n()
  const a = t.automotive.faq
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="automotive-faq" className="scroll-mt-28 border-t border-border bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow={a.eyebrow} title={a.title} />

        <div className="mt-12 flex flex-col gap-3">
          {a.items.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal key={item.q} delay={i * 0.03}>
                <div className="overflow-hidden rounded-2xl border border-border bg-white">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`automotive-faq-panel-${i}`}
                      id={`automotive-faq-trigger-${i}`}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="text-sm font-semibold text-navy sm:text-base">{item.q}</span>
                      <Plus
                        className={cn(
                          "h-4 w-4 shrink-0 text-primary transition-transform duration-300",
                          isOpen && "rotate-45",
                        )}
                        strokeWidth={2.6}
                      />
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="panel"
                        id={`automotive-faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`automotive-faq-trigger-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
