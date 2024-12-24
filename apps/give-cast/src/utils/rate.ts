interface CoinMarketCapResponse {
  data: {
    [key: string]: {
      quote: { USD: { price: number } }
    }
  }
}

export default async function getRates(symbol: string) {
  const coin = symbol.toUpperCase()
  console.debug("Getting CMC ticker for coin", coin)
  let opt: RequestInit
  let res: Response
  let tkr: CoinMarketCapResponse
  let usd: number
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${coin}`
  if (!process.env.TICKER_API_KEY) {
    throw new Error("TICKER_API_KEY is not set")
  }
  try {
    opt = {
      method: "GET",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "X-CMC_PRO_API_KEY": process.env.TICKER_API_KEY || "",
      },
    }
    res = await fetch(url, opt)
    tkr = await res.json()
    usd = tkr?.data[coin]?.quote?.USD?.price || 0
    console.debug("Ticker:", usd)
  } catch (ex) {
    console.error(
      "Error in CMC ticker:",
      ex instanceof Error ? ex.message : "Unknown error",
    )
    usd = 0
  }
  return usd
}
