import "server-only"
import type { ChainSlugs, TokenTickerSymbol } from "@cfce/types"

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

// TODO: handle stablecoins
export default async function getCoinRate({
  symbol,
}: { symbol: TokenTickerSymbol; chain?: ChainSlugs }): Promise<number> {
  try {
    // const response = await mobula.fetchAssetMarketData({
    //   symbol,
    //   blockchain: chain,
    // })
    const options = { method: "GET" }
    const headers = {
      Authorization: `${process.env.MOBULA_API_KEY}`,
    }
    const response = await fetch(
      // EOS and Starknet don't use `eos` and `starknet` as blockchain
      // and there's no need for blockchain unless we're using a token contract
      // so disabled for now
      `https://api.mobula.io/api/1/market/data?symbol=${symbol}`, //&blockchain=${chain}`,
      {
        ...options,
        headers,
      },
    )
    const json = await response.json()
    console.log("RESPONSE", json)

    const rate = json?.data?.price
    if (!rate || typeof rate !== "number") {
      console.log(`No price quote found in response symbol: ${symbol}`)
      //console.log(response.object)
      // throw new Error(`No price quote found in response ${JSON.stringify(response.object?.data)}`)
      return 0
    }
    return rate
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching crypto price quote: ${error.message}`)
      //throw new Error(`Error fetching crypto price quote: ${error.message}`)
    } else {
      console.log("Error fetching crypto price quote")
    }
    return 0
  }
}
