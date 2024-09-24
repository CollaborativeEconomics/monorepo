import { mintAndSaveReceiptNFT } from "@cfce/utils"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const receiptData = await request.json()

    const result = await mintAndSaveReceiptNFT(receiptData)

    if ("error" in result) {
      return Response.json(
        { success: false, error: result.error },
        { status: 400 },
      )
    }

    return Response.json({ success: true, receiptId: result.tokenId })
  } catch (ex) {
    console.error(ex)
    return Response.json(
      {
        success: false,
        error:
          ex instanceof Error ? ex.message : "Unknown error processing receipt",
      },
      { status: 500 },
    )
  }
}
