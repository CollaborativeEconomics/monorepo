import { newCronjob } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Validate cron token from vercel
  const authorized =
    request.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`
  if (!authorized) {
    return NextResponse.json(
      { success: false, error: "Not authorized" },
      { status: 401 },
    )
  }

  try {
    // Test error
    // throw Error('Something went wrong')
    // Do stuff
    const price = (Math.random() * 100).toFixed(2)
    // Save result to db
    await newCronjob({ cron: "price-daily", status: 1, result: { price } })
    return NextResponse.json({ success: true, price })
  } catch (error) {
    console.log(error)
    // Save error to db
    await newCronjob({
      cron: "price-daily",
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
