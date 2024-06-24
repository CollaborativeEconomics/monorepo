// Session data for all pages
export default function Session(req:any) {
  console.log(new Date(), req.url)
  let theme   = req.cookies?.theme||'dark'
  let network = req.cookies?.network||'testnet'
  let wallet  = req.cookies?.wallet||null
  //console.log('Cookies :', req.cookies)
  //console.log('Theme   :', theme)
  //console.log('Network :', network)
  //console.log('wallet :', wallet)
  let data = {theme, network, wallet}
  return data
}
