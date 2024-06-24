export default async function getRates(symbol:string, server:boolean=false){
  console.warn('Getting CMC ticker for symbol', symbol)
  let url, opt, res, tkr, usd
  if(server){
    url = '/api/rates?coin='+symbol
  } else {
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol='+symbol.toUpperCase()
  }
  try {
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
    usd = tkr?.data[symbol]?.quote?.USD?.price || 0
    console.warn('Ticker:', usd)
  } catch(ex:any) {
    console.error('Error in CMC ticker:', ex)
    usd = 0
  }
  return usd
}