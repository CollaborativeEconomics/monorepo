"use server"
import "server-only"
import type { TokenTickerSymbol } from "@cfce/types"
import { getCoinRate } from "@cfce/blockchain-tools/server"

export default async function getRate(
  symbol: TokenTickerSymbol,
) {
  try {
    const rate = await getCoinRate({symbol})
    console.log("RATE", rate)
    return rate
  } catch (error) {
    console.log("RATE ERROR", error)
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}
