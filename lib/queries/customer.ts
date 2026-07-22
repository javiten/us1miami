import "server-only"
import { and, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { packages, wallet, walletTransaction, customerProfile, prealerts, consolidations } from "@/lib/db/schema"

export async function getCustomerPackages(userId: string) {
  return db.select().from(packages).where(eq(packages.userId, userId)).orderBy(desc(packages.createdAt))
}

export async function getCustomerPackage(userId: string, id: number) {
  const rows = await db
    .select()
    .from(packages)
    .where(and(eq(packages.id, id), eq(packages.userId, userId)))
    .limit(1)
  return rows[0] ?? null
}

export async function getCustomerWallet(userId: string) {
  const rows = await db.select().from(wallet).where(eq(wallet.userId, userId)).limit(1)
  if (rows[0]) return rows[0]
  const created = await db.insert(wallet).values({ userId }).onConflictDoNothing().returning()
  if (created[0]) return created[0]
  const again = await db.select().from(wallet).where(eq(wallet.userId, userId)).limit(1)
  return again[0]
}

export async function getWalletTransactions(userId: string) {
  return db
    .select()
    .from(walletTransaction)
    .where(eq(walletTransaction.userId, userId))
    .orderBy(desc(walletTransaction.createdAt))
    .limit(50)
}

export async function getCustomerProfile(userId: string) {
  const rows = await db.select().from(customerProfile).where(eq(customerProfile.userId, userId)).limit(1)
  return rows[0] ?? null
}

export async function getCustomerPrealerts(userId: string) {
  return db.select().from(prealerts).where(eq(prealerts.userId, userId)).orderBy(desc(prealerts.createdAt))
}

export async function getCustomerConsolidations(userId: string) {
  return db.select().from(consolidations).where(eq(consolidations.userId, userId)).orderBy(desc(consolidations.createdAt))
}

export type DashboardStats = {
  expected: number
  received: number
  available: number
  pendingConsolidation: number
  consolidations: number
  inTransit: number
  inArgentina: number
}

export async function getCustomerDashboard(userId: string): Promise<{
  stats: DashboardStats
  recent: Awaited<ReturnType<typeof getCustomerPackages>>
}> {
  const [pkgs, cons] = await Promise.all([
    getCustomerPackages(userId),
    getCustomerConsolidations(userId),
  ])
  const count = (s: string) => pkgs.filter((p) => p.status === s).length
  return {
    stats: {
      expected: count("EXPECTED"),
      received: count("RECEIVED"),
      available: count("IN_WAREHOUSE"),
      pendingConsolidation: count("IN_WAREHOUSE"),
      consolidations: cons.length,
      inTransit: count("IN_TRANSIT"),
      inArgentina: count("DELIVERED"),
    },
    recent: pkgs.slice(0, 5),
  }
}

export { money } from "@/lib/format"
