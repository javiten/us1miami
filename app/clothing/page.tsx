import type { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { ClothingShell } from "@/components/clothing/clothing-shell"
import { buildClothingJsonLd, buildClothingMetadata } from "@/lib/clothing-seo"
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "@/lib/i18n"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://us1miami.com"

// The un-prefixed route auto-detects, so English metadata is the safe default
// for crawlers; /es/clothing and /en/clothing are the canonical variants.
export const metadata: Metadata = buildClothingMetadata("en", "/clothing")

/** Same resolution order as the root layout: cookie first, then geo. */
async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value
  if (isLocale(cookieLocale)) return cookieLocale

  const headerStore = await headers()
  const country = headerStore.get("x-vercel-ip-country")?.toUpperCase()
  return country === "AR" ? "es" : DEFAULT_LOCALE
}

export default async function ClothingPage() {
  const locale = await resolveLocale()
  return (
    <>
      <script
        type="application/ld+json"
        // Structured data is generated from the same dictionary the page renders.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildClothingJsonLd(locale, siteUrl)) }}
      />
      <ClothingShell initialLocale={locale} />
    </>
  )
}
