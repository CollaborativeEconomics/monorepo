"use server"
import "server-only"
import { getCoinRate } from "@cfce/blockchain-tools/server"
import type { TokenTickerSymbol } from "@cfce/types"

export default async function getRate(symbol: TokenTickerSymbol) {
  try {
    const rate = await getCoinRate({ symbol })
    console.log("getRate", symbol, rate)
    return rate
  } catch (error) {
    console.log("RATE ERROR", error)
    throw new Error(error instanceof Error ? error.message : "Unknown error")
  }
}
