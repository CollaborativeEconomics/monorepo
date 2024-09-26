import { NextResponse } from "next/server"

// Fetch stellar rpc servers
// Returns payload result
// On error returns error:message
export default async function fetchLedger(query: string) {
  try {
    const url = (process.env.NEXT_PUBLIC_STELLAR_HORIZON || "") + query
    console.log("FETCH", url)
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
    const result = await fetch(url, options)
    const data = await result.json()
    return data
  } catch (ex) {
    console.error(ex)
    return { error: ex instanceof Error ? ex.message : "Unknown error" }
  }
}
