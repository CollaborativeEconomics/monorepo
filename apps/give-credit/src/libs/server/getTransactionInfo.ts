import fetchLedger from 'libs/server/fetchLedger'

export default async function getTransactionInfo(txid: string) {
  console.log('txid:', txid)
  let txInfo = await fetchLedger('/transactions/'+txid)
  if (!txInfo || 'error' in txInfo) {
    console.log('ERROR', 'Transaction not found:', txid)
    return { error: 'Transaction not found' }
  }
  if (!txInfo?.successful) {
    console.log('ERROR', 'Transaction not valid')
    return { error: 'Transaction not valid' }
  }
  console.log('TXINFO', txInfo)
  return txInfo
}
