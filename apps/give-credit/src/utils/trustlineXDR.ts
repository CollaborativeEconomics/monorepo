import * as StellarSdk from '@stellar/stellar-sdk'

export default async function trustlineXDR(account:string, code:string, issuer:string){
  console.log('Trustline for:', account)
  console.log('Code/issuer:', code, issuer)
  const horizon = new StellarSdk.Horizon.Server(process.env.NEXT_PUBLIC_STELLAR_HORIZON||'')
  const myNFT  = new StellarSdk.Asset(code, issuer)
  const destin = await horizon.loadAccount(account)
  const phrase = process.env.NEXT_PUBLIC_STELLAR_PASSPHRASE||''
  console.log('Network:', process.env.NEXT_PUBLIC_STELLAR_NETWORK||'', phrase)
  console.log('Destin:', JSON.stringify(destin,null,2))
  console.log('Destin:', destin)

  var trustTx = new StellarSdk.TransactionBuilder(destin, {
    networkPassphrase: phrase,
    fee: StellarSdk.BASE_FEE
  })

  const trustline = StellarSdk.Operation.changeTrust({
    asset: myNFT,
    limit: '1000000000',
    source: account
  })

  const built = trustTx
    .addOperation(trustline)
    .setTimeout(120)
    .build()
  
  console.log('BUILT:', JSON.stringify(built,null,2))
  const trid = built.hash().toString('hex')
  const xdr  = built.toXDR()

  return {trid, xdr}
}