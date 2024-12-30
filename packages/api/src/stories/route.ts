import {
  type Prisma,
  type Story,
  addStory,
  getStories,
  newStory,
} from "@cfce/database"
import { createStory } from "@cfce/utils"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../checkApiKey"

// Configure API route to allow multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orgId = searchParams.get("orgId") ?? undefined
    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey, { orgId })

    if (!authorized) {
      return NextResponse.json(
        { success: false, error: "Not authorized" },
        { status: 403 },
      )
    }

    const story = await getStories(Object.fromEntries(searchParams.entries()))
    return NextResponse.json({ success: true, data: story }, { status: 200 }) // Status code 200 for successful GET request
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
    const orgId = req.nextUrl.searchParams.get("orgId") ?? undefined
    const authorized = await checkApiKey(apiKey, { orgId })

    if (!authorized) {
      return NextResponse.json(
        { success: false, error: "Not authorized" },
        { status: 403 },
      )
    }

    const { organizationId, initiativeId, categoryId, ...story } =
      await req.json()

    // Legacy fields, remove them later
    // Modern could should use standard prisma connect syntax
    const storyToCreate: Prisma.StoryCreateInput = { ...story }
    if (organizationId)
      storyToCreate.organization = { connect: { id: organizationId } }
    if (initiativeId)
      storyToCreate.initiative = { connect: { id: initiativeId } }
    if (categoryId) storyToCreate.category = { connect: { id: categoryId } }

    const result = await newStory(storyToCreate)
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

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData()
    const story: Record<string, string> = {}
    const files: Record<string, File> = {}

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files[key] = value
      } else {
        story[key] = value.toString()
      }
    }

    // TODO: type the below better
    const result = await addStory(story as unknown as Story)
    return NextResponse.json({ success: true, data: result }, { status: 200 }) // Status code 200 for successful PUT request
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
    { success: false, error: "Method not allowed" },
    { status: 405 },
  ) // Status code 405 for Method Not Allowed
}
