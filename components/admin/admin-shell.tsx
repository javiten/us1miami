"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"
import { signOutAction } from "@/app/actions/auth"
import type { Permission } from "@/lib/rbac"

type NavItem = {
  href: string
  label: string
  icon: keyof typeof Icons
  permission: Permission
}

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard", permission: "dashboard.view" },
  { href: "/admin/recepcion", label: "Recepción de paquetes", icon: "PackagePlus", permission: "warehouse.receive" },
  { href: "/admin/paquetes", label: "Paquetes", icon: "Boxes", permission: "warehouse.records" },
  { href: "/admin/clientes", label: "Clientes", icon: "Users", permission: "customers.view" },
  { href: "/admin/billeteras", label: "Billeteras", icon: "Wallet", permission: "wallets.view" },
  { href: "/admin/auditoria", label: "Auditoría", icon: "ScrollText", permission: "audit.view" },
]

export function AdminShell({
  children,
  user,
  permissions,
}: {
  children: React.ReactNode
  user: { name: string; email: string; roleLabels: string }
  permissions: Permission[]
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const permSet = new Set(permissions)
  const items = NAV.filter((n) => permSet.has(n.permission))

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy text-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icons.ShieldCheck className="h-4 w-4" />
          </span>
          <span className="font-bold">US1 Miami</span>
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
            Admin
          </span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => {
            const Icon = Icons[item.icon] as React.ComponentType<{ className?: string }>
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-slate-300 hover:bg-white/5 hover:text-white",
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-xs text-slate-400">{user.roleLabels}</p>
            <form action={signOutAction} className="mt-3">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/20"
              >
                <Icons.LogOut className="h-3.5 w-3.5" />
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-navy/50 lg:hidden" onClick={() => setOpen(false)} aria-hidden />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-navy hover:bg-muted lg:hidden"
            aria-label="Abrir menú"
          >
            <Icons.Menu className="h-5 w-5" />
          </button>
          <Link
            href="/admin/recepcion"
            className="ml-auto inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Icons.PackagePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Recibir paquete</span>
          </Link>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
