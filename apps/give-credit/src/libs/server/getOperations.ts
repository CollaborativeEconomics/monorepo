import fetchLedger from 'libs/server/fetchLedger'

export default async function getTransactionInfo(txid: string) {
  console.log('txid:', txid)
  let txInfo = await fetchLedger('/transactions/'+txid+'/operations')
  if (!txInfo || 'error' in txInfo) {
    console.log('ERROR', 'Transaction not found:', txid)
    return { error: 'Transaction not found' }
  }
  console.log('OPS', txInfo?._embedded?.records)
  return txInfo?._embedded?.records
}
