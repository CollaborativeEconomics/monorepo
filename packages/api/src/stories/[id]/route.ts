import { deleteStory, getStoryById, updateStory } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../../checkApiKey"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orgId = searchParams.get("orgId") ?? undefined
    const id = searchParams.get("id")

    const apiKey = req.headers.get("x-api-key")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Story ID required" },
        { status: 400 },
      )
    }

    const authorized = await checkApiKey(apiKey, { orgId })

    if (!authorized) {
      return NextResponse.json({ success: false }, { status: 403 })
    }

    const result = await getStoryById(id)
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

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orgId = searchParams.get("orgId") ?? undefined
    const id = req.nextUrl.pathname.split("/").pop()

    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey, { orgId })

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Story ID required" },
        { status: 400 },
      )
    }

    if (!authorized) {
      return NextResponse.json({ success: false }, { status: 403 })
    }

    // If organizationId is present, ensure the story belongs to the organization
    if (orgId) {
      const story = await getStoryById(id)
      if (story?.organizationId !== orgId) {
        return NextResponse.json(
          { success: false, error: "Access denied for this organization" },
          { status: 403 },
        )
      }
    }

    const body = await req.json()
    const result = await updateStory(id, body)
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

export async function DELETE(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key")
  const authorized = await checkApiKey(apiKey, { devOnly: true })

  if (!authorized) {
    return NextResponse.json({ success: false }, { status: 403 })
  }

  const id = req.nextUrl.pathname.split("/").pop()
  if (!id) {
    return NextResponse.json(
      { success: false, error: "Story ID required" },
      { status: 400 },
    )
  }
  const result = await deleteStory(id)
  return NextResponse.json({ success: true, data: result }, { status: 200 })
}
