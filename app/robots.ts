import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://us1miami.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authenticated surfaces and server endpoints should never be indexed.
      disallow: ["/panel", "/admin", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
