import { getOrganizationById } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../../checkApiKey"

export async function GET(req: NextRequest) {
  console.log("query", req.url)

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

    const result = await getOrganizationById(id)
    return NextResponse.json({ success: true, data: result }, { status: 200 }) // Status code 200 for successful GET request
  } catch (error) {
    console.error(error)
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
    { success: false, error: "Invalid HTTP method" },
    { status: 405 },
  ) // Status code 405 for Method Not Allowed
}
