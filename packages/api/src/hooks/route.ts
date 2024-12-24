import { getHookByTriggerAndOrg } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const triggerName = searchParams.get("triggerName")
  const orgId = searchParams.get("orgId")

  if (!triggerName || !orgId) {
    return NextResponse.json(
      { message: "Missing required parameters: triggerName and orgId" },
      { status: 400 },
    )
  }

  try {
    const hook = await getHookByTriggerAndOrg(
      String(triggerName),
      String(orgId),
    )
    if (hook) {
      return NextResponse.json(hook)
    }
    return NextResponse.json({ message: "Hook not found" }, { status: 404 })
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
