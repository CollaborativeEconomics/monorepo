import { newCronjob, updateCredit } from "@cfce/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log("Getting carbon value")
  const cron = "carbon-price-daily"

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
    const url = `${process.env.STELLAR_CARBON}/carbon-quote?carbon_amount=1`
    const inf = await fetch(url)
    const jsn = await inf.json()
    console.log("DATA", jsn)
    const price = jsn?.average_price || "0"
    console.log("Carbon value:", price)

    if (price !== "0") {
      // save to db
      const creditId = "f4f96aee-741d-4c63-8af5-49340a10b58c" // get from initiative? pass as parameter?
      const value = price
      const ok = await updateCredit(creditId, { value })
      const saved = await newCronjob({
        cron,
        status: 1,
        result: { price },
      })
      console.log("Saved", ok)
    } else {
      await newCronjob({
        cron,
        status: 2,
        result: { error: "Price not available" },
      })
    }

    return NextResponse.json({ success: true, price })
  } catch (ex) {
    console.error("Error fetching API:", ex)
    await newCronjob({
      cron,
      status: 2,
      result: { error: ex instanceof Error ? ex.message : "Unknown error" },
    })
    return NextResponse.json(
      {
        success: false,
        error: ex instanceof Error ? ex.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
