"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Periodically re-runs the current route's server components so dashboard
 * metrics stay near real-time without a full reload. Pauses while the tab is
 * hidden to avoid needless work.
 */
export function AutoRefresh({ intervalMs = 30000 }: { intervalMs?: number }) {
  const router = useRouter()
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") router.refresh()
    }
    const id = setInterval(tick, intervalMs)
    document.addEventListener("visibilitychange", tick)
    return () => {
      clearInterval(id)
      document.removeEventListener("visibilitychange", tick)
    }
  }, [router, intervalMs])
  return null
}
