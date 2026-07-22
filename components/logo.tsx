"use client"

import { useI18n } from "@/components/language-provider"
import { cn } from "@/lib/utils"

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  const { t } = useI18n()
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-[0_6px_18px_-6px_rgba(15,125,255,0.7)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 15.5c3.5 1.8 6 1.8 9 0s5.5-1.8 9 0"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4.5 8.5 12 5l7.5 3.5-7.5 3.5-7.5-3.5Z"
            stroke="white"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className={cn("text-[17px] font-semibold tracking-tight", dark ? "text-white" : "text-navy")}>
          US1 Trade
        </span>
        <span className={cn("text-[10px] font-medium tracking-wide", dark ? "text-white/60" : "text-muted-foreground")}>
          {t.logo.subtitle}
        </span>
      </div>
    </div>
  )
}
