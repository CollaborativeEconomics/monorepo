import * as StellarSdk from '@stellar/stellar-sdk'

export default async function PaymentXDR(source:string, destin:string, amount:number, currency:string, issuer:string, memo:string='') {
  console.log('PAYMENT', source, destin, amount, currency, issuer, memo)
  const horizon = new StellarSdk.Horizon.Server(process.env.NEXT_PUBLIC_STELLAR_HORIZON||'')
  const account = await horizon.loadAccount(source)
  //const baseFee = await server.fetchBaseFee()
  const network = process.env.NEXT_PUBLIC_STELLAR_PASSPHRASE||''
  const operation = StellarSdk.Operation.payment({
    destination: destin,
    amount: amount.toString(),
    asset: StellarSdk.Asset.native()
  })
  const transaction = new StellarSdk.TransactionBuilder(account, {networkPassphrase: network, fee:StellarSdk.BASE_FEE})
  const tx = transaction.addOperation(operation)
  if(memo) { tx.addMemo(StellarSdk.Memo.text(memo)) }
  const built = tx.setTimeout(120).build()
  const txid  = built.hash().toString('hex')
  const xdr   = built.toXDR()
  //console.log('XDR:', xdr)
  //console.log('HASH:', txid)
  return {txid, xdr}
}