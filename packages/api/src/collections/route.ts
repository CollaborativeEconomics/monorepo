import { getCollections, newCollection } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../checkApiKey"

export const GET = async (req: NextRequest) => {
  const headers = req.headers
  const query = Object.fromEntries(new URL(req.url).searchParams.entries())

  const authorized = await checkApiKey(headers.get("x-api-key"))
  if (!authorized) {
    return NextResponse.json(
      { success: false, error: "Not authorized" },
      { status: 403 },
    )
  }

  try {
    const result = await getCollections(query)
    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.log(error)
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 },
    )
  }
}

export const POST = async (req: NextRequest) => {
  const headers = req.headers

  const authorized = await checkApiKey(headers.get("x-api-key"))
  if (!authorized) {
    return NextResponse.json(
      { success: false, error: "Not authorized" },
      { status: 403 },
    )
  }

  try {
    const record = await req.json()
    const result = await newCollection(record)
    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.log(error)
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 },
    )
  }
}
