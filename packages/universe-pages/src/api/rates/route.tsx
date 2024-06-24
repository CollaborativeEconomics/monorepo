export async function GET(request: Request) {
  const requrl = new URL(request.url)
  const symbol = (requrl.searchParams.get('coin') || '').toUpperCase()
  console.warn('Getting CMC ticker for symbol', symbol)
  let url, opt, res, tkr, usd
  try {
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol='+symbol
    opt = {
      method: 'GET', 
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'X-CMC_PRO_API_KEY': process.env.TICKER_API_KEY||''
      }
    }
    res = await fetch(url, opt)
    tkr = await res.json()
    usd = tkr?.data[symbol]?.quote?.USD?.price
    console.warn('Ticker:', usd)
  } catch(ex) {
    console.error('Error in CMC ticker:', ex)
    usd = 0
    tkr = {}
  }
  return Response.json(tkr)
}
