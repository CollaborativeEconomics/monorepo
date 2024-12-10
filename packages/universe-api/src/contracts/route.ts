import { type NextRequest, NextResponse } from "next/server"
import { getContracts, newContract } from "@cfce/database"
import checkApiKey from "../checkApiKey"

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey)

    if (!authorized) {
      return NextResponse.json({ success: false }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())

    const result = await getContracts(query)
    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.error({ error })
    return NextResponse.json({ success: false }, { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey)

    if (!authorized) {
      return NextResponse.json({ success: false }, { status: 403 })
    }

    const record = await req.json()
    const result = await newContract(record)
    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (error) {
    console.error("ERROR:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    )
  }
}

export async function DELETE() {
  const message = "Invalid HTTP method, only GET and POST accepted"
  console.error(message)
  return NextResponse.json({ success: false, error: message }, { status: 400 })
}
