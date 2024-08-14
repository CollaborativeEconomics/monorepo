import { getCategories } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../checkApiKey"

export async function GET(req: NextRequest) {
  try {
    console.log("get")

    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey)

    if (!authorized) {
      return NextResponse.json({ success: false }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())

    const categories = await getCategories(query)
    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
