import { cookies, headers } from "next/headers"
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n"
import { SiteShell } from "@/components/site-shell"

// Resolve the visitor's language: a saved manual preference (cookie) wins,
// otherwise fall back to IP geolocation (Argentina -> Spanish, else English).
async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("us1-locale")?.value
  if (isLocale(cookieLocale)) return cookieLocale

  const headerStore = await headers()
  const country = headerStore.get("x-vercel-ip-country")?.toUpperCase()
  return country === "AR" ? "es" : DEFAULT_LOCALE
}

export default async function Page() {
  const locale = await resolveLocale()
  return <SiteShell initialLocale={locale} />
}
