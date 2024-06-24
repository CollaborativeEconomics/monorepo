export default async function getRates(coinSymbol:string, server:boolean=false){
  console.warn('Getting CMC ticker for symbol', coinSymbol)
  let url, opt, res, tkr, usd
  if(server){
    url = '/api/rates?coin='+coinSymbol
  } else {
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol='+coinSymbol.toUpperCase()
  }
  try {
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
    usd = tkr?.data[coinSymbol]?.quote?.USD?.price || 0
    console.warn('Ticker:', usd)
  } catch(ex:any) {
    console.error('Error in CMC ticker:', ex)
    usd = 0
  }
  return usd
}
