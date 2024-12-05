import {
  getTokenBoundAccount,
  getTokenBoundAccounts,
  newTokenBoundAccount,
} from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../checkApiKey"

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey)

    if (!authorized) {
      return NextResponse.json({ success: false }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)

    const entity_type = searchParams.get("entity_type")
    const entity_id = searchParams.get("entity_id")
    const chain = searchParams.get("chain")
    const network = searchParams.get("network")

    if (!entity_type || !entity_id || !chain || !network) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 },
      )
    }

    const data = await getTokenBoundAccount(
      entity_type,
      entity_id,
      chain,
      network,
    )
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error({ error })
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    )
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
    const result = await newTokenBoundAccount(record)
    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.error("TOKENBOUND ACCOUNT ERROR", { error })
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
  const message = "Invalid HTTP method"
  console.error(message)
  return NextResponse.json({ success: false, error: message }, { status: 400 })
}
