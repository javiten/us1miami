import { headers } from "next/headers"
import { db } from "@/lib/db"
import { auditLog } from "@/lib/db/schema"

type AuditInput = {
  actorUserId?: string | null
  actorName?: string | null
  action: string
  entityType?: string
  entityId?: string | number
  metadata?: Record<string, unknown>
}

/** Records an audit entry. Best-effort: never throws to the caller. */
export async function recordAudit(input: AuditInput): Promise<void> {
  try {
    let ip: string | null = null
    try {
      const h = await headers()
      ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null
    } catch {
      ip = null
    }
    await db.insert(auditLog).values({
      actorUserId: input.actorUserId ?? null,
      actorName: input.actorName ?? null,
      action: input.action,
      entityType: input.entityType ?? null,
      entityId: input.entityId != null ? String(input.entityId) : null,
      metadata: input.metadata ?? null,
      ipAddress: ip,
    })
  } catch (err) {
    console.log("[v0] recordAudit failed:", (err as Error).message)
  }
}
