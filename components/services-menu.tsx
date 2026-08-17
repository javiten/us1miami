"use client"

/**
 * Desktop "Services" dropdown grouping the vertical landing pages.
 *
 * Why this exists: with three verticals the flat nav no longer fits the header
 * bar (it already wrapped between 768px and ~1150px with only two). Grouping
 * them frees roughly 200px and scales to future verticals.
 *
 * Accessibility: the trigger is a real button with `aria-expanded` and
 * `aria-haspopup`. The menu opens on hover for pointer users but also on click
 * and on Enter/Space for keyboard users, closes on Escape (restoring focus to
 * the trigger) and on outside click, and never traps focus.
 */

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type ServiceItem = {
  label: string
  desc: string
  href: string
  /** Fired when the item is activated, for analytics. */
  onSelect?: () => void
}

export function ServicesMenu({
  label,
  srLabel,
  items,
}: {
  label: string
  srLabel: string
  items: ServiceItem[]
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Tracks whether the panel was opened by hover rather than an explicit
  // click. Without this, a pointer user's click would toggle off the menu that
  // their own hover had just opened, so the menu could never be clicked open.
  const openedByHover = useRef(false)

  // Highlight the trigger whenever one of its destinations is the active route.
  const containsActive = items.some((i) => i.href === pathname)

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  // A small close delay keeps the menu usable while the pointer crosses the
  // gap between the trigger and the panel.
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), 140)
  }

  useEffect(() => cancelClose, [])

  // Close when focus or the pointer leaves the whole component, and on Escape.
  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose()
        setOpen((wasOpen) => {
          if (!wasOpen) openedByHover.current = true
          return true
        })
      }}
      onMouseLeave={scheduleClose}
      onFocus={cancelClose}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={srLabel}
        onClick={() =>
          setOpen((wasOpen) => {
            // Clicking a menu that hover already opened should keep it open and
            // hand control to the click, not dismiss it immediately.
            if (wasOpen && openedByHover.current) {
              openedByHover.current = false
              return true
            }
            openedByHover.current = false
            return !wasOpen
          })
        }
        className={cn(
          "flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-navy",
          open || containsActive ? "text-navy" : "text-muted-foreground",
        )}
      >
        {label}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
          strokeWidth={2.4}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 w-[19rem] pt-2"
          // The wrapper's padding bridges the gap so the pointer can travel
          // from trigger to panel without the menu closing underneath it.
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-white p-2 shadow-[0_20px_50px_-20px_rgba(7,27,58,0.28)]">
            {items.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => {
                    item.onSelect?.()
                    setOpen(false)
                  }}
                  className={cn(
                    "flex flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted",
                    active && "bg-muted",
                  )}
                >
                  <span className={cn("text-sm font-semibold", active ? "text-primary" : "text-navy")}>
                    {item.label}
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">{item.desc}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
