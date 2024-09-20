import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

async function showTables() {
  const { rows } = await sql`
    SELECT tablename 
    FROM pg_catalog.pg_tables 
    WHERE schemaname != 'pg_catalog' 
    AND schemaname != 'information_schema'
    ORDER BY tablename
  `
  return rows.map((row) => row.tablename)
}

export async function GET() {
  console.log("> api/test")
  const info = await showTables()

  return NextResponse.json(info || null, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
