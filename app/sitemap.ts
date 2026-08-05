import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://us1miami.com"

/**
 * Public marketing routes only. Customer panel and admin routes are
 * authenticated and deliberately excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/es`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/en`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/automotive`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/es/automotive`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/en/automotive`, lastModified, changeFrequency: "weekly", priority: 0.8 },
  ]
}
