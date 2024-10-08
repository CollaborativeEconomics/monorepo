import { type Prisma, type Story, addStory, getStories } from "@cfce/database"
import { createStory } from "@cfce/utils"
import { File } from "formidable"
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
    const orgId = searchParams.get("orgId")
    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey, orgId ?? undefined)

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
    const { searchParams } = new URL(req.url)
    const orgId = searchParams.get("orgId")
    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey, orgId ?? undefined)

    if (!authorized) {
      return NextResponse.json(
        { success: false, error: "Not authorized" },
        { status: 403 },
      )
    }

    const formData = await req.formData()
    const story: Record<string, string> = {}
    const files: File[] = []

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // @ts-ignore
        files.push(value)
      } else {
        story[key] = value.toString()
      }
    }

    const flattenedTypedStory = Object.keys(story).reduce(
      (acc, key) => {
        const value = story[key]
        switch (key) {
          case "amount":
            acc[key] = Number(value)
            break
          case "inactive":
            acc[key] = value === "true" || value === "1"
            break
          case "created":
            acc[key] = new Date(value)
            break
          default:
            // @ts-ignore
            acc[key] = value
        }
        return acc
      },
      {} as Partial<Story>,
    )

    const images = files.slice(0, 5)
    if (!orgId || !story.initiativeId) {
      return NextResponse.json(
        { success: false, error: "Missing orgId or initiativeId fields" },
        { status: 400 },
      )
    }
    const result = await createStory({
      story: flattenedTypedStory as Omit<
        Prisma.StoryCreateInput,
        "organization" | "initiative"
      >,
      organizationId: orgId,
      initiativeId: story.initiativeId,
      images,
    })
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
        // @ts-ignore formidable File type disagrees with native File type
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
