import { Mobula } from "mobula-sdk"
import type { ChainSlugs, TokenTickerSymbol } from "../chains"

const mobula = new Mobula({ apiKeyAuth: process.env.MOBULA_API_KEY })

export default async function getCoinRate(
  symbol: TokenTickerSymbol,
  chain?: ChainSlugs,
): Promise<number> {
  try {
    const response = await mobula.fetchAssetMarketData({
      symbol,
      blockchain: chain,
    })
    const exchangeRate = response.object?.data?.price
    if (!exchangeRate) {
      throw new Error("Error fetching crypto price quote")
    }
    return exchangeRate
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      throw new Error(`Error fetching crypto price quote: ${error.message}`)
    }
    throw new Error("Error fetching crypto price quote")
  }
}
