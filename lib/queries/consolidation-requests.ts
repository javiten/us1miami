import "server-only"
import { desc, eq, inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { consolidations, packages, user as userTable } from "@/lib/db/schema"

/** Statuses that represent an open customer request needing admin action. */
export const OPEN_REQUEST_STATUSES = ["REQUESTED", "UNDO_REQUESTED"] as const

export type ConsolidationRequestRow = {
  id: number
  status: string
  packageIds: number[]
  notes: string | null
  createdAt: Date
  customerName: string | null
  boxNumber: string | null
}

/** List open consolidation requests (newest first) for the admin queue. */
export async function getConsolidationRequests(): Promise<ConsolidationRequestRow[]> {
  const rows = await db
    .select({
      id: consolidations.id,
      status: consolidations.status,
      packageIds: consolidations.packageIds,
      notes: consolidations.notes,
      createdAt: consolidations.createdAt,
      customerName: userTable.name,
      boxNumber: userTable.boxNumber,
    })
    .from(consolidations)
    .leftJoin(userTable, eq(userTable.id, consolidations.userId))
    .where(inArray(consolidations.status, [...OPEN_REQUEST_STATUSES]))
    .orderBy(desc(consolidations.createdAt))
  return rows.map((r) => ({ ...r, packageIds: (r.packageIds as number[]) ?? [] }))
}

/** Count of open requests, for the nav badge / dashboard. */
export async function getConsolidationRequestCount(): Promise<number> {
  const rows = await getConsolidationRequests()
  return rows.length
}

export type ConsolidationRequestDetail = {
  id: number
  userId: string
  status: string
  cwrNumber: string | null
  notes: string | null
  createdAt: Date
  customerName: string | null
  boxNumber: string | null
  packages: {
    id: number
    wrNumber: string | null
    description: string | null
    store: string | null
    weightLb: string | null
    declaredValue: string | null
    status: string
  }[]
  /** Other packages the same customer could still add to this request. */
  addable: {
    id: number
    wrNumber: string | null
    description: string | null
    store: string | null
    weightLb: string | null
    declaredValue: string | null
  }[]
}

/** Full detail for one request: member packages + packages that can be added. */
export async function getConsolidationRequest(id: number): Promise<ConsolidationRequestDetail | null> {
  const [row] = await db
    .select({
      id: consolidations.id,
      userId: consolidations.userId,
      status: consolidations.status,
      cwrNumber: consolidations.cwrNumber,
      notes: consolidations.notes,
      createdAt: consolidations.createdAt,
      customerName: userTable.name,
      boxNumber: userTable.boxNumber,
      packageIds: consolidations.packageIds,
    })
    .from(consolidations)
    .leftJoin(userTable, eq(userTable.id, consolidations.userId))
    .where(eq(consolidations.id, id))
    .limit(1)
  if (!row) return null

  const ids = (row.packageIds as number[]) ?? []
  const members = ids.length
    ? await db
        .select({
          id: packages.id,
          wrNumber: packages.wrNumber,
          description: packages.description,
          store: packages.store,
          weightLb: packages.weightLb,
          declaredValue: packages.declaredValue,
          status: packages.status,
        })
        .from(packages)
        .where(inArray(packages.id, ids))
    : []

  // Packages of the same customer that are received/processed and not yet in
  // any consolidation — eligible to be added to this request.
  const pool = await db
    .select({
      id: packages.id,
      wrNumber: packages.wrNumber,
      description: packages.description,
      store: packages.store,
      weightLb: packages.weightLb,
      declaredValue: packages.declaredValue,
      status: packages.status,
      consolidationId: packages.consolidationId,
    })
    .from(packages)
    .where(eq(packages.userId, row.userId))
  const addable = pool
    .filter((p) => !ids.includes(p.id) && p.consolidationId == null && ["RECEIVED", "PROCESSED"].includes(p.status))
    .map(({ status: _status, consolidationId: _cid, ...rest }) => rest)

  return {
    id: row.id,
    userId: row.userId,
    status: row.status,
    cwrNumber: row.cwrNumber,
    notes: row.notes,
    createdAt: row.createdAt,
    customerName: row.customerName,
    boxNumber: row.boxNumber,
    packages: members,
    addable,
  }
}
