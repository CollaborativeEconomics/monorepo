"use server"
import type { ChainSlugs, TokenTickerSymbol } from "@cfce/types"
import { Mobula } from "mobula-sdk"

const mobula = new Mobula({ apiKeyAuth: process.env.MOBULA_API_KEY })

// Can't use this hook because it's not server-side
// export function useCoinRate(
//   { symbol, chain }: { symbol: TokenTickerSymbol; chain?: ChainSlugs },
//   dependencyArray: React.DependencyList = [],
// ): number {
//   const [exchangeRate, setExchangeRate] = useState(0)
//   useEffect(() => {
//     getCoinRate({ symbol, chain })
//       .then((rate) => {
//         if (rate) {
//           setExchangeRate(rate)
//         }
//       })
//       .catch((err) => {
//         console.error("Error getting coin rate", err)
//       })
//   }, [symbol, chain, ...dependencyArray])
//   return exchangeRate
// }

export default async function getCoinRate({
  chain,
  symbol,
}: { symbol: TokenTickerSymbol; chain?: ChainSlugs }): Promise<number> {
  "use server"
  try {
    const response = await mobula.fetchAssetMarketData({
      symbol,
      blockchain: chain,
    })
    const rate = response.object?.data?.price
    if (!rate || typeof rate !== "number") {
      console.log(response.object)
      throw new Error(
        `No price quote found in response ${JSON.stringify(response.object?.data)}`,
      )
    }
    return rate
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching crypto price quote: ${error.message}`)
    }
    throw new Error("Error fetching crypto price quote")
  }
}
