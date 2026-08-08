import type { Metadata, Viewport } from "next"
import { Geist, Instrument_Serif } from "next/font/google"
import { cookies, headers } from "next/headers"
import { DEFAULT_LOCALE, isLocale, localeToHtmlLang, type Locale } from "@/lib/i18n"
import { SHIPPING_RATES } from "@/lib/shipping-rates"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

/**
 * Display face for section headlines, large numerals and the pricing figure.
 * Body copy and all UI stay on Geist — see `--font-display` in globals.css.
 * Instrument Serif ships a single 400 weight, so headline emphasis comes from
 * size and measure rather than from bolding it.
 */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://us1miami.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "US1 Miami — Buy Anywhere, Receive in Argentina",
  // Interpolated rather than typed inline — see the note in app/es/page.tsx.
  description: `US1 Miami is an international courier. Shop from anywhere in the world, ship to our Miami warehouse, and we consolidate and deliver everything to Argentina by air in approximately 7 days. From USD $${SHIPPING_RATES.homepageStartingRate}/kg.`,
  keywords: [
    "international courier",
    "Miami to Argentina shipping",
    "courier Miami Argentina",
    "package consolidation",
    "Miami warehouse",
    "air courier",
    "US1 Miami",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "es-AR": "/es",
      "en-US": "/en",
      "x-default": "/en",
    },
  },
  openGraph: {
    title: "US1 Miami — Buy Anywhere, Receive in Argentina",
    description:
      "Shop worldwide, ship to Miami, and we deliver to Argentina in ~7 days. Free receiving, storage and consolidation.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#071b3a",
  width: "device-width",
  initialScale: 1,
}

async function resolveHtmlLang(): Promise<Locale> {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("us1-locale")?.value
  if (isLocale(cookieLocale)) return cookieLocale

  const headerStore = await headers()
  const country = headerStore.get("x-vercel-ip-country")?.toUpperCase()
  return country === "AR" ? "es" : DEFAULT_LOCALE
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await resolveHtmlLang()
  return (
    <html
      lang={localeToHtmlLang(locale)}
      className={`${geist.variable} ${instrumentSerif.variable} bg-background`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
