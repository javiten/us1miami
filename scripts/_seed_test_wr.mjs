import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

const CUST = "Tb2Ff7jcEjgmjCKNYukJihoy7dywKTK7"

async function main() {
  const box = (await pool.query(`select "boxNumber" from "user" where id = $1`, [CUST])).rows[0]?.boxNumber ?? "US1-1000"
  const made = []
  for (const wr of ["WR-TEST-A", "WR-TEST-B"]) {
    // Idempotent: skip if it already exists.
    const ex = await pool.query(`select id from packages where "wrNumber" = $1`, [wr])
    if (ex.rows.length) {
      made.push({ wr, id: ex.rows[0].id, existed: true })
      continue
    }
    const r = await pool.query(
      `insert into packages ("userId","wrNumber","boxNumber","status","quantity","weightLb","description","createdAt","updatedAt")
       values ($1,$2,$3,'PROCESSED',1,'2.50','Prueba consolidación', now(), now()) returning id`,
      [CUST, wr, box],
    )
    made.push({ wr, id: r.rows[0].id, existed: false })
  }
  console.log("SEEDED:", made)
  await pool.end()
}
main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
