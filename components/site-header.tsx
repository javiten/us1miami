"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Menu, X, Phone } from "lucide-react"
import { Logo } from "@/components/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/components/language-provider"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const { t } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const links = [
    { label: t.nav.how, href: "#how-it-works" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.pricing, href: "#pricing" },
    { label: t.nav.warehouse, href: "#warehouse" },
    { label: t.nav.faq, href: "#faq" },
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
        <a href="#top" aria-label="US1 Miami home">
          <Logo className="h-[57px]" />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="tel:+13059679756"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-muted"
          >
            <Phone className="h-4 w-4 text-primary" strokeWidth={2.2} />
            {"(305) 967-9756"}
          </a>
          <LanguageSwitcher />
          <Link
            href="/ingresar"
            className="rounded-xl px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-muted"
          >
            {t.nav.login}
          </Link>
          <a
            href="#quote"
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(15,125,255,0.8)] transition-transform hover:-translate-y-0.5"
          >
            {t.nav.quote}
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
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
          className="mx-auto mt-2 max-w-6xl rounded-2xl border border-border bg-white/95 p-3 shadow-lg backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((l) => (
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
              href="#quote"
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
