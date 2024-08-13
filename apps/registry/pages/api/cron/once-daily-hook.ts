import { prepareDailyHook } from "@/lib/hooks/prepare"
import { newCronjob } from "@cfce/database"
import { Triggers, init, runHook } from "@cfce/registry-hooks"
import { type NextRequest, NextResponse } from "next/server"
import "@/lib/hooks/hookit"

export async function GET(req: NextRequest) {
  const cronName = "once-daily-hook"

  try {
    const authorization = req.headers.get("authorization")
    const authorized = authorization === `Bearer ${process.env.CRON_SECRET}`

    if (!authorized) {
      return NextResponse.json(
        { success: false, error: "Not authorized" },
        { status: 401 },
      )
    }

    // Run hook
    const { organizationId, walletAddress } = await prepareDailyHook()
    const result = await runHook(Triggers.onceDaily, organizationId, {
      walletAddress,
    })
    console.log("RES", result)

    // Save result to db
    await newCronjob({ cron: cronName, status: 1, result })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    // Save error to db
    await newCronjob({
      cron: cronName,
      status: 2,
      result: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    })
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
  )
}
