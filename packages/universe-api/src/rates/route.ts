import { getCoinRate } from "@cfce/blockchain-tools"
import type { ChainSlugs, TokenTickerSymbol } from "@cfce/types"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requrl = new URL(request.url)
  const symbol = (
    requrl.searchParams.get("coin") || ""
  ).toUpperCase() as TokenTickerSymbol
  const chain = (requrl.searchParams.get("chain") || "") as ChainSlugs
  try {
    const rate = await getCoinRate({ symbol, chain })
    console.log("Ticker:", symbol, chain, rate)
    return Response.json({ coin: symbol, rate })
  } catch (ex) {
    console.error("Error in CMC ticker:", ex)
  }
}
