import { eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { wallet, walletTransaction } from "@/lib/db/schema"

export type LedgerType = "CREDIT" | "DEBIT" | "REFUND" | "ADJUSTMENT" | "HOLD" | "RELEASE"

// Credits/debits are appended to the immutable ledger. The wallet row keeps a
// reconciled derived balance updated in the same transaction — never a blind overwrite.
export async function creditWallet(input: {
  userId: string
  amount: number
  type: LedgerType
  description: string
  reference?: string
  createdByUserId?: string
}) {
  const { userId, amount, type, description, reference, createdByUserId } = input
  // Positive types add to available balance; DEBIT/HOLD subtract.
  const sign = type === "DEBIT" || type === "HOLD" ? -1 : 1
  const delta = sign * Math.abs(amount)

  return db.transaction(async (tx) => {
    // Ensure a wallet exists.
    await tx.insert(wallet).values({ userId }).onConflictDoNothing()

    const [updated] = await tx
      .update(wallet)
      .set({
        availableBalance: sql`(${wallet.availableBalance} + ${delta})::numeric(12,2)`,
        updatedAt: new Date(),
      })
      .where(eq(wallet.userId, userId))
      .returning()

    await tx.insert(walletTransaction).values({
      userId,
      walletId: updated.id,
      type,
      amount: Math.abs(amount).toFixed(2),
      balanceAfter: updated.availableBalance,
      description,
      reference: reference ?? null,
      createdByUserId: createdByUserId ?? null,
    })

    return updated
  })
}
