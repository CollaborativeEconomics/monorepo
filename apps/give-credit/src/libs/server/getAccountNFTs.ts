import fetchLedger from 'libs/server/fetchLedger'
import { getNFTsByAccount } from 'utils/registry'

// From database
export async function getAccountNFTs(account: string) {
  const nfts = await getNFTsByAccount(account)
  return nfts
}

// From blockchain
export async function getNFTsFromLedger(account: string) {
  console.log({ account })
  if(!account){
    console.log('ERROR', 'Account is required')
    return { error: 'Account is required' }
  }
  let txInfo = await fetchLedger('/account/'+account)
  if (!txInfo || 'error' in txInfo || txInfo.status==404) {
    console.log('ERROR', 'Account not found:', { account })
    return { error: 'Account not found' }
  }
  console.log('NFTs', txInfo.balances)
  var nfts = []
  for(let i=0; i<txInfo.balances.length; i++){
    if(txInfo.balances[i].asset_code.startsWith('GIVEXLM')){
      nfts.push({
        code: txInfo.balances[i].asset_code,
        issuer: txInfo.balances[i].asset_issuer,
        balance: txInfo.balances[i].balance
      })
    }
  }
  return nfts
}
