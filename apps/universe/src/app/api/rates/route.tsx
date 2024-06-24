export async function GET(request: Request) {
  const requrl = new URL(request.url)
  const coinSymbol = (requrl.searchParams.get('coin') || '').toUpperCase()
  console.warn('Getting CMC ticker for symbol', coinSymbol)
  let url, opt, res, tkr, usd
  try {
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol='+coinSymbol
    opt = {
      method: 'GET', 
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_TICKER_API_KEY||''
      }
    }
    res = await fetch(url, opt)
    tkr = await res.json()
    usd = tkr?.data[coinSymbol]?.quote?.USD?.price
    console.warn('Ticker:', usd)
  } catch(ex) {
    console.error(`Error fetching rates for symbol ${coinSymbol}:`, ex)
    tkr = {}
  }
  return Response.json(tkr)
}
