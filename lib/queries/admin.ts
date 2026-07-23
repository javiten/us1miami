import "server-only"
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import {
  packages,
  wallet,
  walletTransaction,
  customerProfile,
  consolidations,
  masterConsolidations,
  auditLog,
  user,
} from "@/lib/db/schema"

const DASH = "\u2014"

/** Load a CWR by number with its owner + member WRs (for label + deconsolidation). */
export async function getCwrByNumber(cwrNumber: string) {
  const [cwr] = await db
    .select({
      cwr: consolidations,
      customerName: user.name,
      boxNumber: user.boxNumber,
    })
    .from(consolidations)
    .leftJoin(user, eq(user.id, consolidations.userId))
    .where(sql`upper(${consolidations.cwrNumber}) = ${cwrNumber.toUpperCase()}`)
    .limit(1)
  if (!cwr) return null
  const ids = cwr.cwr.packageIds ?? []
  const members = ids.length
    ? await db.select().from(packages).where(inArray(packages.id, ids)).orderBy(packages.wrNumber)
    : []
  return { ...cwr, members }
}

/** Load an MC by number with its member CWRs and loose WRs. */
export async function getMcByNumber(mcNumber: string) {
  const [mc] = await db
    .select()
    .from(masterConsolidations)
    .where(sql`upper(${masterConsolidations.mcNumber}) = ${mcNumber.toUpperCase()}`)
    .limit(1)
  if (!mc) return null
  const cwrIds = mc.cwrIds ?? []
  const pkgIds = mc.packageIds ?? []
  const cwrs = cwrIds.length
    ? await db
        .select({ cwr: consolidations, customerName: user.name, boxNumber: user.boxNumber })
        .from(consolidations)
        .leftJoin(user, eq(user.id, consolidations.userId))
        .where(inArray(consolidations.id, cwrIds))
    : []
  const looseWr = pkgIds.length
    ? await db
        .select({
          id: packages.id,
          wrNumber: packages.wrNumber,
          customerName: user.name,
          boxNumber: packages.boxNumber,
          status: packages.status,
        })
        .from(packages)
        .leftJoin(user, eq(user.id, packages.userId))
        .where(inArray(packages.id, pkgIds))
    : []
  return { mc, cwrs, looseWr, DASH }
}

/** All CWRs for the list view. */
export async function getAllCwrs() {
  return db
    .select({ cwr: consolidations, customerName: user.name, boxNumber: user.boxNumber })
    .from(consolidations)
    .leftJoin(user, eq(user.id, consolidations.userId))
    .orderBy(desc(consolidations.createdAt))
    .limit(100)
}

/** All MCs for the list view. */
export async function getAllMcs() {
  return db.select().from(masterConsolidations).orderBy(desc(masterConsolidations.createdAt)).limit(100)
}

export async function getAdminDashboard() {
  const [pkgAgg] = await db
    .select({
      total: sql<number>`count(*)`,
      expected: sql<number>`count(*) filter (where ${packages.status} = 'EXPECTED')`,
      received: sql<number>`count(*) filter (where ${packages.status} = 'RECEIVED')`,
      // Fold legacy IN_WAREHOUSE into PROCESSED so counts stay correct.
      inWarehouse: sql<number>`count(*) filter (where ${packages.status} in ('PROCESSED','IN_WAREHOUSE'))`,
      readyToShip: sql<number>`count(*) filter (where ${packages.status} = 'READY_TO_SHIP')`,
      inTransit: sql<number>`count(*) filter (where ${packages.status} = 'IN_TRANSIT')`,
      delivered: sql<number>`count(*) filter (where ${packages.status} = 'DELIVERED')`,
      incidents: sql<number>`count(*) filter (where ${packages.status} in ('UNIDENTIFIED','HELD','RETURNED','CANCELLED'))`,
      today: sql<number>`count(*) filter (where ${packages.receivedAt} >= current_date)`,
    })
    .from(packages)

  const [custAgg] = await db
    .select({ total: sql<number>`count(*)` })
    .from(user)
    .where(eq(user.role, "CUSTOMER"))

  const [walletAgg] = await db
    .select({
      available: sql<string>`coalesce(sum(${wallet.availableBalance}), 0)`,
      pending: sql<string>`coalesce(sum(${wallet.pendingBalance}), 0)`,
    })
    .from(wallet)

  const [consAgg] = await db
    .select({ open: sql<number>`count(*) filter (where ${consolidations.status} in ('REQUESTED','IN_PROGRESS'))` })
    .from(consolidations)

  const recentPackages = await db
    .select()
    .from(packages)
    .orderBy(desc(packages.createdAt))
    .limit(8)

  return {
    packages: pkgAgg,
    customers: custAgg,
    wallet: walletAgg,
    consolidations: consAgg,
    recentPackages,
  }
}

export async function getCustomersList(search?: string) {
  const base = db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      boxNumber: user.boxNumber,
      createdAt: user.createdAt,
      city: customerProfile.city,
      province: customerProfile.province,
      available: wallet.availableBalance,
    })
    .from(user)
    .leftJoin(customerProfile, eq(customerProfile.userId, user.id))
    .leftJoin(wallet, eq(wallet.userId, user.id))
    .where(
      search
        ? and(
            eq(user.role, "CUSTOMER"),
            or(
              ilike(user.name, `%${search}%`),
              ilike(user.email, `%${search}%`),
              ilike(user.boxNumber, `%${search}%`),
            ),
          )
        : eq(user.role, "CUSTOMER"),
    )
    .orderBy(desc(user.createdAt))
    .limit(100)
  return base
}

export async function getCustomerDetail(userId: string) {
  const [u] = await db.select().from(user).where(eq(user.id, userId)).limit(1)
  if (!u) return null
  const [profile] = await db.select().from(customerProfile).where(eq(customerProfile.userId, userId)).limit(1)
  const [w] = await db.select().from(wallet).where(eq(wallet.userId, userId)).limit(1)
  const pkgs = await db.select().from(packages).where(eq(packages.userId, userId)).orderBy(desc(packages.createdAt))
  const txs = await db
    .select()
    .from(walletTransaction)
    .where(eq(walletTransaction.userId, userId))
    .orderBy(desc(walletTransaction.createdAt))
    .limit(20)
  return { user: u, profile, wallet: w, packages: pkgs, transactions: txs }
}

export async function getAllPackages(status?: string, search?: string) {
  const term = search?.trim()
  const filters = [
    status ? eq(packages.status, status) : undefined,
    term
      ? or(
          ilike(packages.wrNumber, `%${term}%`),
          ilike(packages.trackingNumber, `%${term}%`),
          ilike(packages.boxNumber, `%${term}%`),
          ilike(packages.description, `%${term}%`),
          ilike(packages.store, `%${term}%`),
          ilike(user.name, `%${term}%`),
        )
      : undefined,
  ].filter(Boolean)
  const rows = await db
    .select({
      id: packages.id,
      status: packages.status,
      wrNumber: packages.wrNumber,
      trackingNumber: packages.trackingNumber,
      boxNumber: packages.boxNumber,
      description: packages.description,
      store: packages.store,
      weightLb: packages.weightLb,
      receivedAt: packages.receivedAt,
      receivedByName: packages.receivedByName,
      customerName: user.name,
      userId: packages.userId,
    })
    .from(packages)
    .leftJoin(user, eq(user.id, packages.userId))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(packages.createdAt))
    .limit(200)
  return rows
}

/** Count of packages per status value, for the filter-tab counters. */
export async function getPackageStatusCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({ status: packages.status, n: sql<number>`count(*)::int` })
    .from(packages)
    .groupBy(packages.status)
  const counts: Record<string, number> = {}
  let total = 0
  for (const r of rows) {
    // Fold any legacy status values into their canonical key.
    const key = r.status === "IN_WAREHOUSE" ? "PROCESSED" : r.status
    counts[key] = (counts[key] ?? 0) + Number(r.n)
    total += Number(r.n)
  }
  counts[""] = total
  return counts
}

export async function getAuditLog() {
  return db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(150)
}

/** Audit entries for a single package (matched by numeric id and WR number). */
export async function getPackageAuditHistory(packageId: number, wrNumber?: string | null) {
  return db
    .select()
    .from(auditLog)
    .where(
      and(
        eq(auditLog.entityType, "package"),
        wrNumber
          ? or(eq(auditLog.entityId, String(packageId)), eq(auditLog.entityId, wrNumber))
          : eq(auditLog.entityId, String(packageId)),
      ),
    )
    .orderBy(desc(auditLog.createdAt))
    .limit(100)
}

/** Fetch a single package by its WR number, joined with customer name + profile, for the label / detail. */
export async function getPackageByWrNumber(wrNumber: string) {
  const [row] = await db
    .select({
      pkg: packages,
      customerName: user.name,
      customerEmail: user.email,
      firstName: customerProfile.firstName,
      lastName: customerProfile.lastName,
    })
    .from(packages)
    .leftJoin(user, eq(user.id, packages.userId))
    .leftJoin(customerProfile, eq(customerProfile.userId, packages.userId))
    .where(eq(packages.wrNumber, wrNumber))
    .limit(1)
  return row ?? null
}

/** Fetch a single package by numeric id, joined with customer name + profile. */
export async function getPackageById(id: number) {
  const [row] = await db
    .select({
      pkg: packages,
      customerName: user.name,
      customerEmail: user.email,
      firstName: customerProfile.firstName,
      lastName: customerProfile.lastName,
    })
    .from(packages)
    .leftJoin(user, eq(user.id, packages.userId))
    .leftJoin(customerProfile, eq(customerProfile.userId, packages.userId))
    .where(eq(packages.id, id))
    .limit(1)
  return row ?? null
}

export async function findCustomerByBox(boxNumber: string) {
  const [u] = await db.select().from(user).where(eq(user.boxNumber, boxNumber)).limit(1)
  return u ?? null
}

export async function searchCustomersForReception(term: string) {
  return db
    .select({ id: user.id, name: user.name, email: user.email, boxNumber: user.boxNumber })
    .from(user)
    .where(
      and(
        eq(user.role, "CUSTOMER"),
        or(ilike(user.name, `%${term}%`), ilike(user.boxNumber, `%${term}%`), ilike(user.email, `%${term}%`)),
      ),
    )
    .limit(10)
}
