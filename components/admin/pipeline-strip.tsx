import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { PACKAGE_STATUS, STATUS_ORDER } from "@/lib/constants"

/**
 * Operational pipeline: one chip per canonical status in flow order, each a
 * link into the filtered package list. Purely presentational (server component).
 */
export function PipelineStrip({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {STATUS_ORDER.map((key, i) => {
        const n = counts[key] ?? 0
        return (
          <div key={key} className="flex items-center gap-2">
            <Link
              href={`/admin/paquetes?status=${key}`}
              className="flex min-w-[110px] flex-col rounded-xl border border-border bg-card px-3 py-2 transition-colors hover:border-primary hover:bg-muted/40"
            >
              <span className="text-lg font-bold text-foreground">{n}</span>
              <span className="text-xs text-muted-foreground">{PACKAGE_STATUS[key]}</span>
            </Link>
            {i < STATUS_ORDER.length - 1 && (
              <ChevronRight className="hidden h-4 w-4 shrink-0 text-muted-foreground/50 lg:block" />
            )}
          </div>
        )
      })}
    </div>
  )
}
