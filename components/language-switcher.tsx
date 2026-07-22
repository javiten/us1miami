"use client"

import { motion } from "motion/react"
import { useI18n } from "@/components/language-provider"
import { cn } from "@/lib/utils"

const OPTIONS = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
] as const

export function LanguageSwitcher({ className, dark = false }: { className?: string; dark?: boolean }) {
  const { locale, setLocale, t } = useI18n()

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={cn(
        "relative inline-flex items-center rounded-full border p-0.5",
        dark ? "border-white/15 bg-white/10" : "border-border bg-muted/60",
        className,
      )}
    >
      {OPTIONS.map((opt) => {
        const active = locale === opt.code
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLocale(opt.code)}
            aria-pressed={active}
            className={cn(
              "relative z-10 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors",
              active
                ? dark
                  ? "text-navy"
                  : "text-primary-foreground"
                : dark
                  ? "text-white/70 hover:text-white"
                  : "text-muted-foreground hover:text-navy",
            )}
          >
            {active && (
              <motion.span
                layoutId={dark ? "lang-pill-dark" : "lang-pill"}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className={cn(
                  "absolute inset-0 -z-10 rounded-full",
                  dark ? "bg-white" : "bg-primary",
                )}
              />
            )}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
