import { pool } from "@/lib/db"

export type CounterName = "box" | "wr" | "cwr" | "aw" | "mawb" | "mc" | "inv"

const PREFIX: Record<CounterName, string> = {
  box: "US1-",
  wr: "WR",
  cwr: "CWR",
  aw: "AW",
  mawb: "MAWB",
  mc: "MC",
  inv: "INV-",
}

/**
 * Atomically increments a counter and returns the new numeric value.
 * Uses a single UPDATE ... RETURNING to avoid race conditions.
 */
export async function nextCounter(name: CounterName): Promise<number> {
  const res = await pool.query<{ value: number }>(
    'UPDATE "counters" SET "value" = "value" + 1 WHERE "name" = $1 RETURNING "value"',
    [name],
  )
  if (res.rows.length === 0) {
    throw new Error(`Counter "${name}" not found`)
  }
  return res.rows[0].value
}

/** Returns a formatted document number, e.g. "US1-1001", "WR100001". */
export async function nextFormatted(name: CounterName): Promise<string> {
  const value = await nextCounter(name)
  return `${PREFIX[name]}${value}`
}

export function formatBoxNumber(value: number): string {
  return `US1-${value}`
}
