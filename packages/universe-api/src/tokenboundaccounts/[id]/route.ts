import { getTokenBoundAccounts } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../../checkApiKey"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey)

    if (!authorized) {
      return NextResponse.json({ success: false }, { status: 403 })
    }

    if (!params.id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 },
      )
    }

    const accounts = await getTokenBoundAccounts({ id: params.id })
    const account = accounts[0] // Since we're querying by ID, we expect at most one result

    if (!account) {
      return NextResponse.json(
        { success: false, error: "Account not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: account }, { status: 200 })
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

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 },
  )
}
