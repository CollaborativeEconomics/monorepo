import { getUserWallets, newUserWallet } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../checkApiKey"

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey)

    if (!authorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      )
    }

    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())

    const result = await getUserWallets(query)
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
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      )
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const { address, chain, network } = await req.json()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 },
      )
    }

    const result = await newUserWallet({
      chain,
      network,
      address,
      users: { connect: { id: userId } },
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

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: "Invalid HTTP method" },
    { status: 405 },
  ) // Status code 405 for Method Not Allowed
}
