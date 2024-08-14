import { getUserById, setUser } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../../checkApiKey"

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey)

    if (!authorized) {
      return NextResponse.json(
        { success: false, error: "Not authorized" },
        { status: 403 },
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 },
      )
    }

    console.log("GET USER ID", id)
    const result = await getUserById(id)

    if (result) {
      return NextResponse.json({ success: true, data: result }, { status: 200 }) // Status code 200 for successful GET request
    }

    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 },
    ) // Status code 404 for not found
  } catch (error) {
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
      return NextResponse.json(
        { success: false, error: "Not authorized" },
        { status: 403 },
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const body = await req.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 },
      )
    }

    console.log("SET USER ID", id)
    const result = await setUser(id, body)
    return NextResponse.json({ success: true, data: result }, { status: 200 }) // Status code 200 for successful POST update request
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
  return NextResponse.json(
    { success: false, error: "HTTP method not supported" },
    { status: 405 },
  ) // Status code 405 for Method Not Allowed
}
