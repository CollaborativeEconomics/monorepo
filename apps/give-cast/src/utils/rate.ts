export default async function getRates(symbol: string) {
  const coin = symbol.toUpperCase()
  console.warn("Getting CMC ticker for coin", coin)
  let opt: any
  let res: any
  let tkr: any
  let usd: number
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${coin}`
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
    console.warn("Ticker:", usd)
  } catch (ex: any) {
    console.error("Error in CMC ticker:", ex)
    usd = 0
  }
  return usd
}
