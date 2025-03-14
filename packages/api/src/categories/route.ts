import { getCategories } from "@cfce/database"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import checkApiKey from "../checkApiKey"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    //const headersList = await headers()
    //const apiKey = headersList.get("x-api-key")
    //const authorized = await checkApiKey(apiKey)
    //if (!authorized) {
    //  return NextResponse.json({ success: false }, { status: 403 })
    //}
    //const { searchParams } = new URL(req.url)
    //const query = Object.fromEntries(searchParams.entries())
    //console.log('CATS-QRY', query)
    //const categories = await getCategories(query)
    const categories = await getCategories({})
    console.log('DB-CATS', categories?.length)
    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
