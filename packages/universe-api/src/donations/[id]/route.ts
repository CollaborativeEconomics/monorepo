import { getDonations } from "@cfce/database"
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
    const query = Object.fromEntries(searchParams.entries())

    const result = await getDonations(query)
    return NextResponse.json(
      { success: true, data: result[0] },
      { status: 201 },
    )
  } catch (error) {
    console.error({ error })
    return NextResponse.json({ success: false }, { status: 400 })
  }
}

export async function DELETE() {
  const message = "Invalid HTTP method, only GET accepted"
  console.error(message)
  return NextResponse.json({ success: false, error: message }, { status: 400 })
}
