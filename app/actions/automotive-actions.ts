"use server"

import { put } from "@vercel/blob"
import { db } from "@/lib/db"
import { automotiveQuotes } from "@/lib/db/schema"
import { getSessionUser } from "@/lib/session"
import {
  QUOTE_MAX_FILES,
  QUOTE_MAX_FILE_BYTES,
  QUOTE_ACCEPTED_FILE_TYPES,
  isPurchaseMethod,
  type PurchaseMethod,
} from "@/lib/automotive"

export type QuoteFormState = {
  ok?: boolean
  message?: string
  /** Field-keyed validation errors, rendered inline next to each input. */
  errors?: Record<string, string>
}

/** Copy for the two locales. Server actions cannot read the client i18n context. */
const MESSAGES = {
  es: {
    required: "Este campo es obligatorio.",
    email: "Ingresá un email válido.",
    phone: "Ingresá un teléfono válido.",
    url: "Ingresá un enlace válido (debe empezar con http:// o https://).",
    year: "Ingresá un año entre 1950 y el próximo año.",
    quantity: "La cantidad debe ser un número entero entre 1 y 999.",
    price: "Ingresá un monto válido.",
    method: "Elegí una modalidad de compra.",
    tooManyFiles: `Podés adjuntar hasta ${QUOTE_MAX_FILES} archivos.`,
    fileTooBig: "Cada archivo debe pesar menos de 8 MB.",
    fileType: "Formato no permitido. Usá JPG, PNG, WEBP, HEIC o PDF.",
    uploadFailed: "No pudimos subir los archivos. Intentá de nuevo.",
    failed: "No pudimos enviar tu solicitud. Intentá de nuevo en unos minutos.",
    success: "Recibimos tu solicitud. Te responderemos con la cotización a la brevedad.",
  },
  en: {
    required: "This field is required.",
    email: "Enter a valid email address.",
    phone: "Enter a valid phone number.",
    url: "Enter a valid link (it must start with http:// or https://).",
    year: "Enter a year between 1950 and next year.",
    quantity: "Quantity must be a whole number between 1 and 999.",
    price: "Enter a valid amount.",
    method: "Choose a purchase method.",
    tooManyFiles: `You can attach up to ${QUOTE_MAX_FILES} files.`,
    fileTooBig: "Each file must be smaller than 8 MB.",
    fileType: "Unsupported format. Use JPG, PNG, WEBP, HEIC or PDF.",
    uploadFailed: "We could not upload your files. Please try again.",
    failed: "We could not send your request. Please try again in a few minutes.",
    success: "We received your request. We will get back to you with a quote shortly.",
  },
} as const

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim()

export async function submitAutomotiveQuote(
  _prev: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  const locale = str(formData, "locale") === "en" ? "en" : "es"
  const m = MESSAGES[locale]
  const errors: Record<string, string> = {}

  // --- Contact (required) ---------------------------------------------------
  const firstName = str(formData, "firstName")
  const lastName = str(formData, "lastName")
  const email = str(formData, "email")
  const phone = str(formData, "phone")
  const description = str(formData, "description")

  if (!firstName) errors.firstName = m.required
  if (!lastName) errors.lastName = m.required
  if (!email) errors.email = m.required
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = m.email
  if (!phone) errors.phone = m.required
  // Permissive on formatting, strict on having enough digits to be callable.
  else if ((phone.match(/\d/g) ?? []).length < 7) errors.phone = m.phone
  if (!description) errors.description = m.required

  // --- Purchase method (required) ------------------------------------------
  const purchaseMethodRaw = str(formData, "purchaseMethod")
  if (!isPurchaseMethod(purchaseMethodRaw)) errors.purchaseMethod = m.method
  const purchaseMethod = purchaseMethodRaw as PurchaseMethod

  // --- Vehicle / part (optional, validated when present) -------------------
  const yearRaw = str(formData, "vehicleYear")
  let vehicleYear: number | null = null
  if (yearRaw) {
    const parsed = Number(yearRaw)
    const maxYear = new Date().getFullYear() + 1
    if (!Number.isInteger(parsed) || parsed < 1950 || parsed > maxYear) errors.vehicleYear = m.year
    else vehicleYear = parsed
  }

  const quantityRaw = str(formData, "quantity")
  let quantity = 1
  if (quantityRaw) {
    const parsed = Number(quantityRaw)
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 999) errors.quantity = m.quantity
    else quantity = parsed
  }

  const productUrl = str(formData, "productUrl")
  if (productUrl && !/^https?:\/\/.+\..+/i.test(productUrl)) errors.productUrl = m.url

  const priceRaw = str(formData, "estimatedPrice")
  let estimatedPrice: string | null = null
  if (priceRaw) {
    const normalized = priceRaw.replace(/[^0-9.]/g, "")
    const parsed = Number(normalized)
    if (!normalized || !Number.isFinite(parsed) || parsed < 0) errors.estimatedPrice = m.price
    else estimatedPrice = parsed.toFixed(2)
  }

  // --- Attachments ---------------------------------------------------------
  const files = formData
    .getAll("attachments")
    .filter((f): f is File => f instanceof File && f.size > 0)

  if (files.length > QUOTE_MAX_FILES) {
    errors.attachments = m.tooManyFiles
  } else {
    for (const file of files) {
      if (file.size > QUOTE_MAX_FILE_BYTES) {
        errors.attachments = m.fileTooBig
        break
      }
      if (!(QUOTE_ACCEPTED_FILE_TYPES as readonly string[]).includes(file.type)) {
        errors.attachments = m.fileType
        break
      }
    }
  }

  if (Object.keys(errors).length > 0) return { errors }

  // Upload only after validation passes, so a rejected form never leaves
  // orphaned blobs behind.
  let attachments: { url: string; name: string; contentType: string }[] = []
  if (files.length > 0) {
    try {
      attachments = await Promise.all(
        files.map(async (file) => {
          const blob = await put(`automotive-quotes/${Date.now()}-${file.name}`, file, {
            access: "public",
            addRandomSuffix: true,
          })
          return { url: blob.url, name: file.name, contentType: file.type }
        }),
      )
    } catch (error) {
      console.log("[v0] automotive quote attachment upload failed:", error)
      return { errors: { attachments: m.uploadFailed } }
    }
  }

  // Associate the request with the account when the visitor happens to be
  // logged in; the form is public, so this is optional.
  const sessionUser = await getSessionUser().catch(() => null)

  try {
    await db.insert(automotiveQuotes).values({
      userId: sessionUser?.id ?? null,
      firstName,
      lastName,
      email,
      phone,
      boxNumber: str(formData, "boxNumber") || sessionUser?.boxNumber || null,
      vehicleYear,
      make: str(formData, "make") || null,
      model: str(formData, "model") || null,
      trim: str(formData, "trim") || null,
      engine: str(formData, "engine") || null,
      vin: str(formData, "vin").toUpperCase() || null,
      partNumber: str(formData, "partNumber") || null,
      productUrl: productUrl || null,
      description,
      quantity,
      purchaseMethod,
      estimatedPrice,
      notes: str(formData, "notes") || null,
      attachments,
      locale,
      status: "NEW",
    })
  } catch (error) {
    console.log("[v0] automotive quote insert failed:", error)
    return { errors: { form: m.failed } }
  }

  return { ok: true, message: m.success }
}
