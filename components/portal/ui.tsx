import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"
import { PACKAGE_STATUS, STATUS_ORDER, type PackageStatus } from "@/lib/constants"

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-balance text-2xl font-bold tracking-tight text-navy">{title}</h1>
        {description && <p className="mt-1.5 text-pretty text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function StatCard({
  label,
  value,
  icon,
  tone = "default",
  hint,
}: {
  label: string
  value: string | number
  icon: keyof typeof Icons
  tone?: "default" | "primary" | "success" | "warning"
  hint?: string
}) {
  const Icon = Icons[icon] as React.ComponentType<{ className?: string }>
  const tones: Record<string, string> = {
    default: "bg-muted text-navy",
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
  }
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", tones[tone])}>
          {Icon && <Icon className="h-5 w-5" />}
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-navy">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground/70">{hint}</p>}
    </div>
  )
}

const STATUS_TONES: Record<PackageStatus, string> = {
  EXPECTED: "bg-slate-100 text-slate-600",
  RECEIVED: "bg-sky-50 text-sky-600",
  IN_WAREHOUSE: "bg-blue-50 text-blue-600",
  CONSOLIDATING: "bg-amber-50 text-amber-600",
  READY_TO_SHIP: "bg-violet-50 text-violet-600",
  IN_TRANSIT: "bg-indigo-50 text-indigo-600",
  DELIVERED: "bg-emerald-50 text-emerald-600",
}

export function StatusBadge({ status }: { status: string }) {
  const key = (status in PACKAGE_STATUS ? status : "EXPECTED") as PackageStatus
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_TONES[key])}>
      {PACKAGE_STATUS[key]}
    </span>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: keyof typeof Icons
  title: string
  description?: string
  action?: React.ReactNode
}) {
  const Icon = Icons[icon] as React.ComponentType<{ className?: string }>
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        {Icon && <Icon className="h-6 w-6" />}
      </span>
      <h3 className="mt-4 text-base font-semibold text-navy">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function StatusTimeline({ current }: { current: PackageStatus }) {
  const currentIndex = STATUS_ORDER.indexOf(current)
  return (
    <ol className="space-y-0">
      {STATUS_ORDER.map((s, i) => {
        const done = i <= currentIndex
        const isCurrent = i === currentIndex
        return (
          <li key={s} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs",
                  done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-transparent",
                )}
              >
                {done && <Icons.Check className="h-3 w-3" />}
              </span>
              {i < STATUS_ORDER.length - 1 && (
                <span className={cn("h-8 w-0.5", i < currentIndex ? "bg-primary" : "bg-border")} />
              )}
            </div>
            <span
              className={cn(
                "pt-0.5 text-sm",
                isCurrent ? "font-semibold text-navy" : done ? "text-navy/70" : "text-muted-foreground",
              )}
            >
              {PACKAGE_STATUS[s]}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm", className)}>{children}</div>
}
