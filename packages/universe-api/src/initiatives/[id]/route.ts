import {
  deleteInitiative,
  getInitiativeById,
  updateInitiative,
} from "@cfce/database"
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

    const result = await getInitiativeById(id)
    return NextResponse.json({ success: true, data: result }, { status: 201 })
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
  const apiKey = req.headers.get("x-api-key")
  const authorized = await checkApiKey(apiKey)

  if (!authorized) {
    return NextResponse.json({ success: false }, { status: 403 })
  }

  const id = req.nextUrl.pathname.split("/").pop()

  if (!id) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const data = await req.json()
  const result = await updateInitiative(id, data)
  return NextResponse.json({ success: true, data: result }, { status: 200 })
}

export async function DELETE(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key")
  const authorized = await checkApiKey(apiKey, undefined, true)

  if (!authorized) {
    return NextResponse.json({ success: false }, { status: 403 })
  }

  const id = req.nextUrl.pathname.split("/").pop()
  if (!id) {
    return NextResponse.json({ success: false }, { status: 400 })
  }
  const result = await deleteInitiative(id)
  return NextResponse.json({ success: true, data: result }, { status: 200 })
}
