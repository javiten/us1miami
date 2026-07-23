import "server-only"
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { invoices, consolidations, packages, auditLog, user } from "@/lib/db/schema"

export type InvoiceListFilter = {
  status?: string
  search?: string
}

/** Counters for the admin invoices dashboard (by effective bucket). */
export async function getInvoiceCounters() {
  const [row] = await db
    .select({
      total: sql<number>`count(*)`,
      open: sql<number>`count(*) filter (where ${invoices.status} = 'OPEN')`,
      manual: sql<number>`count(*) filter (where ${invoices.status} = 'PENDING_MANUAL_PAYMENT')`,
      review: sql<number>`count(*) filter (where ${invoices.status} = 'REQUIRES_REVIEW')`,
      paid: sql<number>`count(*) filter (where ${invoices.status} = 'PAID')`,
      cancelled: sql<number>`count(*) filter (where ${invoices.status} = 'CANCELLED')`,
      overdue: sql<number>`count(*) filter (where ${invoices.status} in ('OPEN','PENDING_MANUAL_PAYMENT') and ${invoices.dueDate} is not null and ${invoices.dueDate} < now())`,
      outstanding: sql<number>`coalesce(sum(${invoices.subtotal}) filter (where ${invoices.status} in ('OPEN','PENDING_MANUAL_PAYMENT')), 0)`,
      collected: sql<number>`coalesce(sum(${invoices.subtotal}) filter (where ${invoices.status} = 'PAID'), 0)`,
    })
    .from(invoices)
  return row
}

/** Admin list with optional status + search (invoice #, CWR #, customer). */
export async function getInvoicesForAdmin(filter: InvoiceListFilter = {}) {
  const conds = []
  if (filter.status && filter.status !== "ALL") {
    if (filter.status === "OVERDUE") {
      conds.push(
        sql`${invoices.status} in ('OPEN','PENDING_MANUAL_PAYMENT') and ${invoices.dueDate} is not null and ${invoices.dueDate} < now()`,
      )
    } else {
      conds.push(eq(invoices.status, filter.status))
    }
  }
  if (filter.search) {
    const q = `%${filter.search}%`
    conds.push(or(ilike(invoices.invoiceNumber, q), ilike(consolidations.cwrNumber, q), ilike(user.name, q), ilike(user.boxNumber, q)))
  }
  return db
    .select({
      invoice: invoices,
      cwrNumber: consolidations.cwrNumber,
      cwrStatus: consolidations.status,
      customerName: user.name,
      boxNumber: user.boxNumber,
    })
    .from(invoices)
    .leftJoin(consolidations, eq(consolidations.id, invoices.consolidationId))
    .leftJoin(user, eq(user.id, invoices.userId))
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(invoices.createdAt))
    .limit(200)
}

/** Full invoice detail: invoice + CWR + customer + member WRs + audit trail. */
export async function getInvoiceDetail(invoiceId: number) {
  const [row] = await db
    .select({
      invoice: invoices,
      cwr: consolidations,
      customerName: user.name,
      customerEmail: user.email,
      boxNumber: user.boxNumber,
    })
    .from(invoices)
    .leftJoin(consolidations, eq(consolidations.id, invoices.consolidationId))
    .leftJoin(user, eq(user.id, invoices.userId))
    .where(eq(invoices.id, invoiceId))
    .limit(1)
  if (!row) return null
  const ids = row.cwr?.packageIds ?? []
  const members = ids.length
    ? await db.select().from(packages).where(inArray(packages.id, ids)).orderBy(packages.wrNumber)
    : []
  const trail = await db
    .select()
    .from(auditLog)
    .where(and(eq(auditLog.entityType, "invoice"), eq(auditLog.entityId, row.invoice.invoiceNumber ?? "")))
    .orderBy(desc(auditLog.createdAt))
    .limit(50)
  return { ...row, members, trail }
}

/** A customer's own invoice for a given consolidation (checkout page). */
export async function getCustomerInvoiceByConsolidation(userId: string, consolidationId: number) {
  const [row] = await db
    .select({ invoice: invoices, cwr: consolidations })
    .from(invoices)
    .leftJoin(consolidations, eq(consolidations.id, invoices.consolidationId))
    .where(and(eq(invoices.consolidationId, consolidationId), eq(invoices.userId, userId)))
    .limit(1)
  if (!row) return null
  const ids = row.cwr?.packageIds ?? []
  const members = ids.length
    ? await db.select().from(packages).where(inArray(packages.id, ids)).orderBy(packages.wrNumber)
    : []
  return { ...row, members }
}

/** All invoices belonging to a customer (panel list). */
export async function getCustomerInvoices(userId: string) {
  return db
    .select({ invoice: invoices, cwrNumber: consolidations.cwrNumber, cwrStatus: consolidations.status })
    .from(invoices)
    .leftJoin(consolidations, eq(consolidations.id, invoices.consolidationId))
    .where(eq(invoices.userId, userId))
    .orderBy(desc(invoices.createdAt))
}
