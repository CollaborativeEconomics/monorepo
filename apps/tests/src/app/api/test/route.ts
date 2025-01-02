import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  console.log("TEST")
  return NextResponse.json({ success: true, data: "OK" }, { status: 200 })
}
