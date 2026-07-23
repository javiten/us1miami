import { Pool } from "pg"
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
const c = await pool.connect()
try {
  const r = await c.query(`select id from consolidations where "cwrNumber"='CWR-5002'`)
  console.log("CID:" + r.rows[0].id)
} finally {
  c.release()
  await pool.end()
}
