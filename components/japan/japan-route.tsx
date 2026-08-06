"use client"

import { Plane } from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { JAPAN_ROUTE } from "@/lib/japan"
import { cn } from "@/lib/utils"

/**
 * The Japan -> Miami -> Argentina route visual.
 *
 * Rendered as an ordered list so the sequence is conveyed structurally rather
 * than only by the connecting lines, which are decorative and hidden from
 * assistive tech. The origin node carries the crimson accent; the hub and
 * destination stay navy so the eye reads the direction of travel.
 */
export function JapanRoute({ className }: { className?: string }) {
  const { t } = useI18n()
  const r = t.japan.hero

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white/95 px-5 py-4 shadow-[0_18px_40px_-20px_rgba(7,27,58,0.4)] backdrop-blur-md",
        className,
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{r.routeLabel}</p>

      <ol className="mt-3 flex items-center justify-between gap-1">
        {JAPAN_ROUTE.map((leg, i) => (
          <li key={leg} className="flex min-w-0 items-center gap-1">
            <span
              className={cn(
                "whitespace-nowrap text-sm font-semibold",
                i === 0 ? "text-japan-red" : "text-navy",
              )}
            >
              {r.route[leg]}
            </span>

            {/* Connector between consecutive legs; purely decorative. */}
            {i < JAPAN_ROUTE.length - 1 && (
              <span className="flex items-center gap-1 px-1" aria-hidden="true">
                <span className="h-px w-3 bg-border sm:w-5" />
                <Plane className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.2} />
              </span>
            )}
          </li>
        ))}
      </ol>

      <p className="mt-3 text-pretty text-[11px] leading-relaxed text-muted-foreground">{r.routeNote}</p>
    </div>
  )
}
