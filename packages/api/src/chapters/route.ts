import { getChapters, newChapter } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../checkApiKey"

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key")
  const authorized = await checkApiKey(apiKey)

  if (!authorized) {
    return NextResponse.json({ success: false }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())
    const result = await getChapters(query)
    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (error) {
    console.error({ error })
    return NextResponse.json({ success: false }, { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key")
  const authorized = await checkApiKey(apiKey)

  if (!authorized) {
    return NextResponse.json({ success: false }, { status: 403 })
  }

  try {
    const body = await req.json()
    const result = await newChapter(body)
    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.error({ error })
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
