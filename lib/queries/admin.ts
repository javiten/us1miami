import "server-only"
import { and, desc, eq, ilike, or, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { packages, wallet, walletTransaction, customerProfile, consolidations, auditLog, user } from "@/lib/db/schema"

export async function getAdminDashboard() {
  const [pkgAgg] = await db
    .select({
      total: sql<number>`count(*)`,
      expected: sql<number>`count(*) filter (where ${packages.status} = 'EXPECTED')`,
      received: sql<number>`count(*) filter (where ${packages.status} = 'RECEIVED')`,
      inWarehouse: sql<number>`count(*) filter (where ${packages.status} = 'IN_WAREHOUSE')`,
      inTransit: sql<number>`count(*) filter (where ${packages.status} = 'IN_TRANSIT')`,
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

export async function getAllPackages(status?: string) {
  const rows = await db
    .select({
      id: packages.id,
      status: packages.status,
      wrNumber: packages.wrNumber,
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
    .where(status ? eq(packages.status, status) : undefined)
    .orderBy(desc(packages.createdAt))
    .limit(200)
  return rows
}

export async function getAuditLog() {
  return db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(150)
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
