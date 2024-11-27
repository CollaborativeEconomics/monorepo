import { deleteStoryMedia, getStoryMediaById } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../../checkApiKey"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orgId = searchParams.get("orgId") ?? undefined
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Story media ID required" },
        { status: 400 },
      )
    }

    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey, { orgId })

    if (!authorized) {
      return NextResponse.json({ success: false }, { status: 403 })
    }

    const result = await getStoryMediaById(id)
    return NextResponse.json({ success: true, data: result }, { status: 200 }) // Status code 200 for successful GET request
  } catch (error) {
    console.error("ERROR", error)
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

  const id = req.nextUrl.pathname.split("/").pop()
  if (!id) {
    return NextResponse.json({ success: false }, { status: 400 })
  }
  await deleteStoryMedia(id)
  return NextResponse.json({ success: true }, { status: 200 })
}
