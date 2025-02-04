import "server-only"

// Not really for practical use, but useful for testing
import type { ChainSlugs, TokenTickerSymbol } from "@cfce/types"
import chainConfiguration from "../chains/chainConfig"
import getCoinRate from "./getCoinRate"

export type CoinRateResult = {
  // chain: ChainSlugs
  symbol: TokenTickerSymbol
  rate: number
}

export async function getAllCoinRates(): Promise<CoinRateResult[]> {
  const results: CoinRateResult[] = []
  const chains = Object.values(chainConfiguration)

  // Process all requests concurrently
  const ratePromises = chains.map(async (chain) => {
    try {
      const rate = await getCoinRate({
        // chain: chain.slug,
        symbol: chain.symbol as TokenTickerSymbol,
      })

      return {
        // chain: chain.slug,
        symbol: chain.symbol as TokenTickerSymbol,
        rate,
      }
    } catch (error) {
      console.error(`Error fetching rate for ${chain.slug}:`, error)
      return {
        chain: chain.slug,
        symbol: chain.symbol as TokenTickerSymbol,
        rate: 0,
      }
    }
  })

  // Wait for all requests to complete
  const completedResults = await Promise.all(ratePromises)
  results.push(...completedResults)

  return results
}

// Example usage:
// const rates = await getAllCoinRates()
// rates.forEach(({chain, symbol, rate}) => {
//   console.log(`${chain} ${symbol}: $${rate}`)
// })
