export const MIAMI_ADDRESS = {
  line1: "20855 NE 16th Ave",
  suite: "Suite C26",
  city: "Miami",
  state: "FL",
  zip: "33179",
  country: "United States",
  phone: "(305) 967-9756",
} as const

export const COMPANY = {
  name: "US1 Miami",
  email: "info@us1miami.com",
  phone: "(305) 967-9756",
  whatsapp: "13059679756",
} as const

/** Full Miami shipping address for a given customer + box. */
export function formatCustomerAddress(fullName: string, boxNumber: string): string {
  return [
    fullName,
    MIAMI_ADDRESS.line1,
    `${MIAMI_ADDRESS.suite} - Box ${boxNumber}`,
    `${MIAMI_ADDRESS.city}, ${MIAMI_ADDRESS.state} ${MIAMI_ADDRESS.zip}`,
    MIAMI_ADDRESS.country,
    `Phone: ${MIAMI_ADDRESS.phone}`,
  ].join("\n")
}

export const PACKAGE_STATUS = {
  EXPECTED: "Pre-alertado",
  RECEIVED: "Recibido en Miami",
  IN_WAREHOUSE: "En depósito",
  CONSOLIDATING: "En consolidación",
  READY_TO_SHIP: "Listo para envío",
  IN_TRANSIT: "En tránsito",
  DELIVERED: "Entregado",
} as const

export type PackageStatus = keyof typeof PACKAGE_STATUS

export const STATUS_ORDER: PackageStatus[] = [
  "EXPECTED",
  "RECEIVED",
  "IN_WAREHOUSE",
  "CONSOLIDATING",
  "READY_TO_SHIP",
  "IN_TRANSIT",
  "DELIVERED",
]
