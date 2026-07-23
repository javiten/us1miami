"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as Icons from "lucide-react"
import { Logo } from "@/components/logo"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export type NavItem = {
  href: string
  label: string
  icon: keyof typeof Icons
  badge?: number
}

export type NavGroup = { title?: string; items: NavItem[] }

export function PortalShell({
  groups,
  user,
  variant = "customer",
  children,
}: {
  groups: NavGroup[]
  user: { name: string; email: string; boxNumber?: string | null; roleLabel?: string }
  variant?: "customer" | "admin"
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const dark = variant === "admin"

  async function signOut() {
    await authClient.signOut()
    router.push(variant === "admin" ? "/admin/login" : "/ingresar")
    router.refresh()
  }

  const isActive = (href: string) =>
    pathname === href || (href !== "/panel" && href !== "/admin" && pathname.startsWith(href))

  return (
    <div className={cn("min-h-screen", dark ? "bg-navy" : "bg-background")}>
      {/* Mobile top bar */}
      <div
        className={cn(
          "flex items-center justify-between border-b px-4 py-3 lg:hidden",
          dark ? "border-white/10 bg-navy" : "border-border bg-card",
        )}
      >
        <div className="rounded-lg bg-white px-2 py-1">
          <Logo />
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn("rounded-lg p-2", dark ? "text-white" : "text-navy")}
          aria-label="Abrir menú"
        >
          <Icons.Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 shrink-0 transform overflow-y-auto border-r transition-transform lg:static lg:translate-x-0",
            dark ? "border-white/10 bg-navy" : "border-border bg-card",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="px-6 py-6">
              <Link href={variant === "admin" ? "/admin" : "/panel"} className="inline-flex rounded-lg bg-white px-3 py-2">
                <Logo />
              </Link>
              {variant === "admin" && (
                <p className="mt-3 text-xs font-medium uppercase tracking-wider text-white/50">Consola de operaciones</p>
              )}
            </div>

            <nav className="flex-1 space-y-6 px-3 pb-6">
              {groups.map((group, gi) => (
                <div key={gi}>
                  {group.title && (
                    <p
                      className={cn(
                        "mb-2 px-3 text-xs font-semibold uppercase tracking-wider",
                        dark ? "text-white/40" : "text-muted-foreground",
                      )}
                    >
                      {group.title}
                    </p>
                  )}
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = Icons[item.icon] as React.ComponentType<{ className?: string }>
                      const active = isActive(item.href)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                            active
                              ? dark
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary text-primary-foreground"
                              : dark
                                ? "text-white/70 hover:bg-white/10 hover:text-white"
                                : "text-navy/70 hover:bg-muted hover:text-navy",
                          )}
                        >
                          {Icon && <Icon className="h-4.5 w-4.5 shrink-0" />}
                          <span className="flex-1">{item.label}</span>
                          {item.badge ? (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-xs font-semibold",
                                active ? "bg-white/25 text-white" : "bg-primary/15 text-primary",
                              )}
                            >
                              {item.badge}
                            </span>
                          ) : null}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className={cn("border-t p-4", dark ? "border-white/10" : "border-border")}>
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
                    dark ? "bg-white/15 text-white" : "bg-primary/10 text-primary",
                  )}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className={cn("truncate text-sm font-semibold", dark ? "text-white" : "text-navy")}>{user.name}</p>
                  <p className={cn("truncate text-xs", dark ? "text-white/50" : "text-muted-foreground")}>
                    {user.roleLabel ?? (user.boxNumber ? `Box ${user.boxNumber}` : user.email)}
                  </p>
                </div>
              </div>
              <button
                onClick={signOut}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-muted text-navy hover:bg-border",
                )}
              >
                <Icons.LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </aside>

        {open && (
          <div className="fixed inset-0 z-30 bg-navy/40 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
        )}

        {/* Main */}
        <main className="min-w-0 flex-1">
          <div className={cn("min-h-screen", dark ? "rounded-none lg:my-2 lg:mr-2 lg:rounded-2xl lg:bg-background" : "")}>
            <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
