"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import {
  type Dictionary,
  type Locale,
  LOCALE_COOKIE,
  getDictionary,
  isLocale,
  localeToHtmlLang,
} from "@/lib/i18n"

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Dictionary
}

const I18nContext = createContext<I18nContextValue | null>(null)

function persistLocale(locale: Locale) {
  // Cookie keeps the choice available for SSR + geolocation override.
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
  try {
    localStorage.setItem(LOCALE_COOKIE, locale)
  } catch {
    // localStorage may be unavailable (private mode) — cookie is enough.
  }
  document.documentElement.lang = localeToHtmlLang(locale)
}

export function LanguageProvider({
  initialLocale,
  forced = false,
  children,
}: {
  initialLocale: Locale
  /** When true (e.g. /es or /en routes), the URL wins and becomes the saved preference. */
  forced?: boolean
  children: React.ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    if (forced) {
      // Explicit locale route: treat the visited language as a manual selection.
      if (initialLocale !== locale) setLocaleState(initialLocale)
      persistLocale(initialLocale)
      return
    }
    // On the root route, a previously saved manual preference overrides IP detection.
    let stored: string | null = null
    try {
      stored = localStorage.getItem(LOCALE_COOKIE)
    } catch {
      stored = null
    }
    if (isLocale(stored)) {
      if (stored !== locale) setLocaleState(stored)
      persistLocale(stored)
    } else {
      persistLocale(initialLocale)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    persistLocale(next)
  }, [])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: getDictionary(locale) }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error("useI18n must be used within a LanguageProvider")
  }
  return ctx
}
