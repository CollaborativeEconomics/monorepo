import { deleteSession, getSession, newSession } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../checkApiKey"

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
    const query = Object.fromEntries(searchParams.entries())

    const result = await getSession(query)
    return NextResponse.json({ success: true, data: result }, { status: 200 }) // Status code 200 for successful GET request
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

    const record = await req.json()
    const result = await newSession(record)
    return NextResponse.json({ success: true, data: result }, { status: 201 }) // Status code 201 for successful POST request
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

export async function DELETE(req: NextRequest) {
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
    const query = Object.fromEntries(searchParams.entries())

    if (!query.token) {
      throw new Error("Token is missing")
    }

    const result = await deleteSession(query as { token: string })
    return NextResponse.json({ success: true, data: result }, { status: 200 }) // Status code 200 for successful DELETE request
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

export async function PUT() {
  return NextResponse.json(
    { success: false, error: "HTTP method not supported" },
    { status: 405 },
  ) // Status code 405 for Method Not Allowed
}
