import {
  addStoryMedia,
  deleteStoryMediaByStoryId,
  getStoryMedia,
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
    const query = Object.fromEntries(searchParams.entries())

    const result = await getStoryMedia(query)
    return NextResponse.json({ success: true, data: result }, { status: 200 }) // Status code 200 for successful GET request
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

    const { searchParams } = new URL(req.url)
    const storyId = searchParams.get("id")?.toString()
    const body = await req.json()

    if (!storyId) {
      return NextResponse.json(
        { success: false, error: "Story ID required" },
        { status: 400 },
      )
    }

    const result = await addStoryMedia(storyId, body)
    return NextResponse.json({ success: true, data: result }, { status: 201 }) // Status code 201 for successful POST request
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

export async function DELETE(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key")
  const authorized = await checkApiKey(apiKey, { devOnly: true })

  if (!authorized) {
    return NextResponse.json({ success: false }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const storyId = searchParams.get("id")?.toString()

  if (!storyId) {
    return NextResponse.json(
      { success: false, error: "Story ID required" },
      { status: 400 },
    )
  }

  const result = await deleteStoryMediaByStoryId(storyId)
  return NextResponse.json({ success: true, data: result }, { status: 200 })
}
