import { getUsers, newUser } from "@cfce/database"
//import { createNewUser } from "@cfce/utils"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../checkApiKey"

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey)

    if (!authorized) {
      console.log("noauth")
      return NextResponse.json(
        { success: false, error: "Not authorized" },
        { status: 403 },
      )
    }

    console.log("auth")
    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())

    console.log("get", query)
    const result = await getUsers(query)
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
      console.log("noauth")
      return NextResponse.json(
        { success: false, error: "Not authorized" },
        { status: 403 },
      )
    }

    console.log("auth")
    const record = await req.json()
    // TODO: replace newUser with createNewUser for TBA
    //user = await createNewUser(walletAddress, chainName, network, useTBA)
    const result = await newUser(record)
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

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: "HTTP method not supported" },
    { status: 405 },
  ) // Status code 405 for Method Not Allowed
}
