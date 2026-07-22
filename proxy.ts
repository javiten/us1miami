import { NextResponse, type NextRequest } from "next/server"
import { LOCALE_COOKIE } from "@/lib/i18n"

// Detects the visitor country via IP geolocation and sets a default locale cookie
// the first time they arrive. Argentina -> Spanish, everyone else -> English.
// A manual selection later overwrites this cookie, so detection only ever seeds it.
export function proxy(req: NextRequest) {
  const res = NextResponse.next()

  if (!req.cookies.get(LOCALE_COOKIE)) {
    const country = req.headers.get("x-vercel-ip-country")?.toUpperCase()
    const locale = country === "AR" ? "es" : "en"
    res.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    })
  }

  return res
}

export const config = {
  matcher: ["/", "/es", "/en"],
}
