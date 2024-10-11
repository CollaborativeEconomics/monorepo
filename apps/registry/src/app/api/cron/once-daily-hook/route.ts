import { newCronjob } from "@cfce/database"
import { Triggers, runHook } from "@cfce/registry-hooks"
import { type NextRequest, NextResponse } from "next/server"
import { prepareDailyHook } from "~/lib/hooks/prepare"

export async function GET(request: NextRequest) {
  const cronName = "once-daily-hook"

  // Validate cron token from vercel
  //const authorized = request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
  //if (!authorized) {
  //  return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 })
  //}

  try {
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
    // Save error to db
    console.log(error)
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
