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

// --- Canonical package lifecycle -------------------------------------------
// One status per package. Tabs/cards are filters over this single field.
// The main flow is linear; incidents are off-flow exception states.
export const PACKAGE_STATUS = {
  EXPECTED: "Prealertado",
  RECEIVED: "Recibido en Miami",
  PROCESSED: "Procesado",
  CONSOLIDATING: "En consolidación",
  READY_TO_SHIP: "Listo para envío",
  IN_TRANSIT: "En tránsito",
  IN_ARGENTINA: "En Argentina",
  DELIVERED: "Entregado",
} as const

export const PACKAGE_INCIDENTS = {
  UNIDENTIFIED: "No identificado",
  HELD: "Retenido",
  RETURNED: "Devuelto",
  CANCELLED: "Cancelado",
  DAMAGED: "Dañado",
  MISSING: "Faltante",
} as const

// Off-flow warehouse states used by the consolidation / master-cargo pipeline.
// A WR carries exactly one of these while it is locked inside a CWR or MC.
export const PACKAGE_CONSOLIDATION_STATUS = {
  CONSOLIDATED_IN_CWR: "Consolidado en CWR",
  IN_MASTER: "En carga maestra",
  RECEIVED_ARGENTINA: "Recibido en Argentina",
  READY_FOR_DELIVERY_AR: "Listo para entrega",
} as const

// Every valid status label, keyed by its stored value.
export const ALL_PACKAGE_STATUS = {
  ...PACKAGE_STATUS,
  ...PACKAGE_CONSOLIDATION_STATUS,
  ...PACKAGE_INCIDENTS,
} as const

export type PackageStatus = keyof typeof PACKAGE_STATUS
export type PackageIncident = keyof typeof PACKAGE_INCIDENTS
export type PackageConsolidationStatus = keyof typeof PACKAGE_CONSOLIDATION_STATUS
export type AnyPackageStatus = keyof typeof ALL_PACKAGE_STATUS

// Ordered main flow — used by the timeline and the operational pipeline.
export const STATUS_ORDER: PackageStatus[] = [
  "EXPECTED",
  "RECEIVED",
  "PROCESSED",
  "CONSOLIDATING",
  "READY_TO_SHIP",
  "IN_TRANSIT",
  "IN_ARGENTINA",
  "DELIVERED",
]

export const INCIDENT_KEYS: PackageIncident[] = [
  "UNIDENTIFIED",
  "HELD",
  "RETURNED",
  "CANCELLED",
  "DAMAGED",
  "MISSING",
]

// Allowed transitions for the MANUAL status control (WR drawer). The
// consolidation/deconsolidation workflows write their locked states directly
// and are intentionally NOT reachable from this manual map.
export const VALID_TRANSITIONS: Record<AnyPackageStatus, AnyPackageStatus[]> = {
  EXPECTED: ["RECEIVED", "UNIDENTIFIED", "CANCELLED"],
  RECEIVED: ["PROCESSED", "HELD", "RETURNED", "UNIDENTIFIED"],
  PROCESSED: ["CONSOLIDATING", "READY_TO_SHIP", "HELD", "RETURNED"],
  CONSOLIDATING: ["READY_TO_SHIP", "PROCESSED", "HELD"],
  READY_TO_SHIP: ["IN_TRANSIT", "CONSOLIDATING", "HELD"],
  IN_TRANSIT: ["IN_ARGENTINA", "HELD"],
  IN_ARGENTINA: ["DELIVERED", "HELD"],
  DELIVERED: [],
  // Consolidation-locked states are managed by their workflows; allow only
  // incident escalation and the forward delivery step from Argentina states.
  CONSOLIDATED_IN_CWR: ["HELD", "DAMAGED"],
  IN_MASTER: ["HELD", "DAMAGED"],
  RECEIVED_ARGENTINA: ["READY_FOR_DELIVERY_AR", "DELIVERED", "HELD", "DAMAGED"],
  READY_FOR_DELIVERY_AR: ["DELIVERED", "HELD", "DAMAGED"],
  UNIDENTIFIED: ["RECEIVED", "RETURNED", "CANCELLED"],
  HELD: ["PROCESSED", "READY_TO_SHIP", "RETURNED", "CANCELLED"],
  RETURNED: [],
  CANCELLED: [],
  DAMAGED: ["HELD", "RETURNED", "CANCELLED"],
  MISSING: ["RECEIVED_ARGENTINA", "HELD", "CANCELLED"],
}

/** Normalize any stored value to a known status key (legacy-safe). */
export function normalizeStatus(status: string): AnyPackageStatus {
  if (status in ALL_PACKAGE_STATUS) return status as AnyPackageStatus
  if (status === "IN_WAREHOUSE") return "PROCESSED" // legacy → canonical
  return "EXPECTED"
}

/** Human label for any status value. */
export function statusLabel(status: string): string {
  return ALL_PACKAGE_STATUS[normalizeStatus(status)]
}

export function isIncident(status: string): boolean {
  return normalizeStatus(status) in PACKAGE_INCIDENTS
}

/** Statuses an admin may move a package to from its current status. */
export function allowedTransitions(status: string): AnyPackageStatus[] {
  return VALID_TRANSITIONS[normalizeStatus(status)] ?? []
}

export function canTransition(from: string, to: string): boolean {
  return allowedTransitions(from).includes(normalizeStatus(to))
}

// CWR (customer consolidation) lifecycle.
export const CONSOLIDATION_STATUS = {
  REQUESTED: "Solicitada",
  IN_PROGRESS: "En proceso",
  PENDING_PAYMENT: "Pago requerido",
  READY_TO_SHIP: "Lista para envío",
  CONSOLIDATED_IN_MC: "En carga maestra",
  IN_TRANSIT: "En tránsito",
  RECEIVED_ARGENTINA: "Recibida en Argentina",
  DECONSOLIDATED: "Desconsolidada",
  COMPLETED: "Completada",
  SHIPPED: "Enviada",
  CANCELLED: "Cancelada",
} as const

export function cwrStatusLabel(status: string): string {
  return (CONSOLIDATION_STATUS as Record<string, string>)[status] ?? status
}

// MC (master consolidation) lifecycle.
export const MASTER_STATUS = {
  OPEN: "Abierta",
  READY_TO_SHIP: "Lista para envío",
  IN_TRANSIT: "En tránsito",
  RECEIVED_ARGENTINA: "Recibida en Argentina",
  DECONSOLIDATED: "Desconsolidada",
  CANCELLED: "Cancelada",
} as const

export function mcStatusLabel(status: string): string {
  return (MASTER_STATUS as Record<string, string>)[status] ?? status
}

export const PREALERT_STATUS = {
  PENDING: "Pendiente",
  MATCHED: "Vinculada",
  EXPIRED: "Vencida",
} as const

export const WALLET_TX_LABELS = {
  DEPOSIT: "Depósito",
  CREDIT: "Crédito",
  DEBIT: "Débito",
  ADJUSTMENT: "Ajuste manual",
  HOLD: "Retención",
  RELEASE: "Liberación",
  SHIPPING_CHARGE: "Cargo de envío",
  REFUND: "Reembolso",
} as const
