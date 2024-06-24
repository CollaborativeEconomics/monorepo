import fetchLedger from 'libs/server/fetchLedger'

export default async function checkTrustline(account:string, token:string, issuer:string){
  console.log('Checking trustline for account', account, 'and token', token, issuer)
  let url = '/accounts/'+account
  let result = await fetchLedger(url)
  console.log('Trustlines', result)
  if(result.error){
    console.log('Trustline Error:', result.error)
    return false
  }
  for(var i=0; i<result.balances.length; i++){
    if(result.balances[i].asset_code==token && result.balances[i].asset_issuer==issuer){
      console.log('Trustline found', result.balances[i])
      return true
    }
  }
  console.log('Trustline not found')
  return false
}