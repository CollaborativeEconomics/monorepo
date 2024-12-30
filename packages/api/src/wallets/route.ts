import { type Prisma, getWallets, newWallet } from "@cfce/database"
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

    const result = await getWallets(query)
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
    const organizationId = searchParams.get("organizationid")
    const initiativeId = searchParams.get("initiative_id")
    const body = await req.json()
    const { address, chain } = body

    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: "Organization ID required" },
        { status: 400 },
      )
    }

    const wallet: Prisma.WalletCreateInput = {
      chain,
      address,
      organizations: { connect: { id: organizationId } },
    }

    if (initiativeId) {
      wallet.initiatives = { connect: { id: initiativeId } }
    }

    const result = await newWallet(wallet)
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
