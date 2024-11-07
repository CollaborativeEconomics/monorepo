import { auth } from "@cfce/auth"
import { setUser } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      )
    }

    // @ts-ignore TODO: move userId out of session, or fix session types
    const { userId } = session
    const apiKey = uuidv4()
    const data = { api_key: apiKey }
    const result = await setUser(userId, data).catch(console.warn)

    console.log({ userId, data, result })
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
    { success: false, error: "HTTP method not supported" },
    { status: 405 },
  ) // Status code 405 for Method Not Allowed
}
