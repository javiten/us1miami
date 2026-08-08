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
    { url: `${siteUrl}/clothing`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/es/clothing`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/en/clothing`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/electronics`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/es/electronics`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/en/electronics`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/japan`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/es/japan`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/en/japan`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    // A tool rather than a service page, but it is linked from every page's
    // primary nav and is a common entry point for pricing searches. Lower
    // change frequency: it only changes when a published rate changes.
    { url: `${siteUrl}/calculator`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/es/calculator`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/en/calculator`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ]
}
