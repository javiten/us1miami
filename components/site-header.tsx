"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { Menu, X, Phone } from "lucide-react"
import { Logo } from "@/components/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/components/language-provider"
import { ServicesMenu, type ServiceItem } from "@/components/services-menu"
import { AUTOMOTIVE_PATH } from "@/lib/automotive"
import { CLOTHING_PATH } from "@/lib/clothing"
import { ELECTRONICS_PATH } from "@/lib/electronics"
import { JAPAN_PATH } from "@/lib/japan"
import { COMPANY } from "@/lib/constants"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const { t } = useI18n()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // Section links live on the homepage. When the header renders on another
  // route (e.g. /automotive) they must be absolute, otherwise they resolve
  // against the current path and silently do nothing.
  const onHome = pathname === "/" || pathname === "/es" || pathname === "/en"
  const section = (hash: string) => (onHome ? hash : `/${hash}`)

  // The vertical landing pages are grouped into a dropdown on desktop. A flat
  // nav no longer fits the header bar once there are three of them. The same
  // list drives the mobile panel, so the analytics source is a parameter
  // rather than being baked in.
  const buildVerticals = (source: "header" | "mobile_menu"): ServiceItem[] => [
    {
      label: t.nav.automotive,
      desc: t.nav.automotiveDesc,
      href: AUTOMOTIVE_PATH,
      onSelect: () => track("automotive_nav_click", { source }),
    },
    {
      label: t.nav.clothing,
      desc: t.nav.clothingDesc,
      href: CLOTHING_PATH,
      onSelect: () => track("clothing_nav_click", { source }),
    },
    {
      label: t.nav.electronics,
      desc: t.nav.electronicsDesc,
      href: ELECTRONICS_PATH,
      onSelect: () => track("electronics_nav_click", { source }),
    },
    {
      label: t.nav.japan,
      desc: t.nav.japanDesc,
      href: JAPAN_PATH,
      onSelect: () => track("japan_nav_click", { source }),
    },
  ]

  // Homepage anchor links, shown on either side of the Services dropdown.
  const anchorLinks = [
    { label: t.nav.how, href: section("#how-it-works") },
    { label: t.nav.pricing, href: section("#pricing") },
    { label: t.nav.warehouse, href: section("#warehouse") },
    { label: t.nav.faq, href: section("#faq") },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6"
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 sm:px-5",
          scrolled
            ? "border border-border/70 bg-white/80 shadow-[0_8px_30px_-12px_rgba(7,27,58,0.18)] backdrop-blur-xl"
            : "border border-transparent bg-transparent",
        )}
      >
        <Link href={onHome ? "#top" : "/"} aria-label="US1 Miami home">
          <Logo className="h-[57px]" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <a
            href={anchorLinks[0].href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
          >
            {anchorLinks[0].label}
          </a>

          <ServicesMenu label={t.nav.services} srLabel={t.nav.servicesMenu} items={buildVerticals("header")} />

          {anchorLinks.slice(1).map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={`tel:+${COMPANY.whatsapp}`}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-muted"
          >
            <Phone className="h-4 w-4 text-primary" strokeWidth={2.2} />
            {COMPANY.phone}
          </a>
          <LanguageSwitcher />
          <Link
            href="/ingresar"
            className="rounded-xl px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-muted"
          >
            {t.nav.login}
          </Link>
          <a
            href={section("#quote")}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(15,125,255,0.8)] transition-transform hover:-translate-y-0.5"
          >
            {t.nav.quote}
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-navy"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-6xl rounded-2xl border border-border bg-white/95 p-3 shadow-lg backdrop-blur-xl lg:hidden"
        >
          <nav className="flex flex-col" aria-label="Mobile">
            <a
              href={anchorLinks[0].href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
            >
              {anchorLinks[0].label}
            </a>

            {/* The verticals are listed inline here rather than nested behind a
                second tap, since vertical space is not constrained on mobile. */}
            <p className="mt-2 px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
              {t.nav.services}
            </p>
            {buildVerticals("mobile_menu").map((v) => (
              <Link
                key={v.href}
                href={v.href}
                aria-current={pathname === v.href ? "page" : undefined}
                onClick={() => {
                  v.onSelect?.()
                  setOpen(false)
                }}
                className={cn(
                  "rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted hover:text-navy",
                  pathname === v.href ? "text-navy" : "text-muted-foreground",
                )}
              >
                {v.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-border" />

            {anchorLinks.slice(1).map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/ingresar"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
            >
              {t.nav.login}
            </Link>
            <a
              href={section("#quote")}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
            >
              {t.nav.quote}
            </a>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}
