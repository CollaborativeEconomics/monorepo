import { getNFTById } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../../checkApiKey"

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey)

    if (!authorized) {
      return NextResponse.json({ success: false }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 },
      )
    }

    const nft = await getNFTById(id)
    return NextResponse.json({ success: true, data: nft }, { status: 200 })
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
