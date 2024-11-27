import { deleteDonation, getDonations } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../../checkApiKey"

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key")
    const authorized = await checkApiKey(apiKey)

    if (!authorized) {
      return NextResponse.json({ success: false }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())

    const result = await getDonations(query)
    return NextResponse.json(
      { success: true, data: result[0] },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key")
  const authorized = await checkApiKey(apiKey, undefined, true)

  if (!authorized) {
    return NextResponse.json({ success: false }, { status: 403 })
  }

  const id = req.nextUrl.pathname.split("/").pop()
  if (!id) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const result = await deleteDonation(id)

  return NextResponse.json({ success: true, data: result }, { status: 200 })
}
