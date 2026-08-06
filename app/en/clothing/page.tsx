import type { Metadata } from "next"
import { ClothingShell } from "@/components/clothing/clothing-shell"
import { buildClothingJsonLd, buildClothingMetadata } from "@/lib/clothing-seo"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://us1miami.com"

export const metadata: Metadata = buildClothingMetadata("en", "/en/clothing")

export default function ClothingPageEn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildClothingJsonLd("en", siteUrl)) }}
      />
      <ClothingShell initialLocale="en" forced />
    </>
  )
}
