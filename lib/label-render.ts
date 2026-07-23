import "server-only"
import bwipjs from "bwip-js/node"
import QRCode from "qrcode"

const DASH = "\u2014" // em dash

/** Generate a Code 128 barcode as an inline SVG string encoding the given value. */
export function generateBarcodeSvg(value: string): string {
  return bwipjs.toSVG({
    bcid: "code128",
    text: value,
    scale: 3,
    height: 9,
    includetext: false,
    paddingwidth: 0,
    paddingheight: 0,
  })
}

/** Generate a QR code as an inline SVG string linking to the WR detail URL. */
export async function generateQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#ffffff" },
  })
}

type PackageRow = {
  wrNumber: string | null
  receivedAt: Date | null
  createdAt: Date
  store: string | null
  trackingNumber: string | null
  carrier: string | null
  weightLb: string | null
  lengthIn: string | null
  widthIn: string | null
  heightIn: string | null
  description: string | null
  warehouseLocation: string | null
  receivedByName: string | null
  notes: string | null
}

const FLAG_RULES: { flag: string; test: RegExp }[] = [
  { flag: "FRÁGIL", test: /fr[aá]gil|fragile/i },
  { flag: "DAÑADO", test: /da[ñn]ad|damag|roto|abolla/i },
  { flag: "HOLD", test: /hold|reten|retenci[oó]n/i },
  { flag: "REVISIÓN", test: /revis|inspec|verificar/i },
  { flag: "NO IDENTIFICADO", test: /no identif|sin identif|unknown|desconocid/i },
]

/**
 * Show only the operator's name on the label — strip any trailing role suffix
 * like "Javier (Super Admin)" → "Javier". Handles existing stored data too.
 */
function operatorName(name: string | null | undefined): string {
  if (!name) return DASH
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim() || DASH
}

/** Derive operational handling flags from the internal notes text. */
export function deriveFlags(notes: string | null | undefined): string[] {
  if (!notes) return []
  return FLAG_RULES.filter((r) => r.test.test(notes)).map((r) => r.flag)
}

const dateFmt = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "America/New_York",
})
const timeFmt = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/New_York",
})

export type LabelData = {
  wrNumber: string
  dateStr: string
  timeStr: string
  dateTimeStr: string
  store: string
  tracking: string
  carrier: string
  weight: string
  size: string
  pieces: string
  content: string
  location: string
  operator: string
  notes: string
  flags: string[]
}

/** Build the display-ready label fields from a raw package row. Empty fields become an em dash. */
export function buildLabelData(pkg: PackageRow): LabelData {
  const when = pkg.receivedAt ?? pkg.createdAt
  const dims =
    pkg.lengthIn && pkg.widthIn && pkg.heightIn
      ? `${pkg.lengthIn} \u00d7 ${pkg.widthIn} \u00d7 ${pkg.heightIn} in`
      : DASH
  const dateStr = dateFmt.format(when)
  const timeStr = timeFmt.format(when)

  return {
    wrNumber: pkg.wrNumber ?? DASH,
    dateStr,
    timeStr,
    dateTimeStr: `${dateStr} ${timeStr}`,
    store: pkg.store || DASH,
    tracking: pkg.trackingNumber || DASH,
    carrier: pkg.carrier || DASH,
    weight: pkg.weightLb ? `${pkg.weightLb} lb` : DASH,
    size: dims,
    pieces: "1",
    content: pkg.description || DASH,
    location: pkg.warehouseLocation || DASH,
    operator: operatorName(pkg.receivedByName),
    notes: pkg.notes || DASH,
    flags: deriveFlags(pkg.notes),
  }
}
