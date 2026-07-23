// Invoice domain: statuses, payment methods, labels, and display helpers.

export const INVOICE_STATUS = {
  DRAFT: "Borrador",
  OPEN: "Pendiente de pago",
  PENDING_MANUAL_PAYMENT: "Pago en verificación",
  PAID: "Pagada",
  OVERDUE: "Vencida",
  REQUIRES_REVIEW: "Requiere revisión",
  CANCELLED: "Cancelada",
  REFUNDED: "Reembolsada",
} as const

export type InvoiceStatus = keyof typeof INVOICE_STATUS

export function invoiceStatusLabel(status: string): string {
  return (INVOICE_STATUS as Record<string, string>)[status] ?? status
}

// Tailwind tone classes per status (badge backgrounds/text).
export const INVOICE_STATUS_TONES: Record<InvoiceStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  OPEN: "bg-amber-50 text-amber-700",
  PENDING_MANUAL_PAYMENT: "bg-sky-50 text-sky-700",
  PAID: "bg-emerald-50 text-emerald-700",
  OVERDUE: "bg-red-50 text-red-700",
  REQUIRES_REVIEW: "bg-orange-50 text-orange-700",
  CANCELLED: "bg-gray-200 text-gray-600",
  REFUNDED: "bg-indigo-50 text-indigo-700",
}

export function invoiceStatusTone(status: string): string {
  return INVOICE_STATUS_TONES[status as InvoiceStatus] ?? "bg-slate-100 text-slate-600"
}

export const PAYMENT_METHOD = {
  WALLET: "Saldo en billetera",
  CARD: "Tarjeta de crédito/débito",
  CASH: "Efectivo",
  MERCADO_PAGO: "Mercado Pago",
} as const

export type PaymentMethod = keyof typeof PAYMENT_METHOD

export function paymentMethodLabel(method?: string | null): string {
  if (!method) return "—"
  return (PAYMENT_METHOD as Record<string, string>)[method] ?? method
}

/** Methods that settle instantly (customer self-service) vs. manual verification. */
export const INSTANT_METHODS: PaymentMethod[] = ["WALLET", "CARD"]
export const MANUAL_METHODS: PaymentMethod[] = ["CASH", "MERCADO_PAGO"]

// The label shown on operationally blocked consolidations.
export const PAYMENT_REQUIRED_LABEL = "PAYMENT_REQUIRED"

/** A shipping invoice is only "settled" when PAID. */
export function isInvoicePaid(status: string): boolean {
  return status === "PAID"
}

/**
 * Effective status for display: an OPEN / PENDING_MANUAL_PAYMENT invoice that is
 * past its due date is surfaced as OVERDUE without mutating the stored row.
 */
export function effectiveInvoiceStatus(row: {
  status: string
  dueDate?: Date | string | null
}): InvoiceStatus {
  const status = row.status as InvoiceStatus
  if ((status === "OPEN" || status === "PENDING_MANUAL_PAYMENT") && row.dueDate) {
    const due = typeof row.dueDate === "string" ? new Date(row.dueDate) : row.dueDate
    if (due instanceof Date && !Number.isNaN(due.getTime()) && due.getTime() < Date.now()) {
      return "OVERDUE"
    }
  }
  return status
}

// Default net term (days) before an unpaid invoice is considered overdue.
export const INVOICE_DUE_DAYS = 7
