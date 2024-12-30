import * as StellarSDK from '@stellar/stellar-sdk'
import {isConnected, getNetwork, getNetworkDetails, requestAccess, signTransaction} from "@stellar/freighter-api"

export const networks = {
  mainnet: {
    name: 'public',
    passphrase: 'Public Global Stellar Network ; September 2015',
    horizon: 'https://horizon.stellar.org',
    soroban: 'https://mainnet.stellar.validationcloud.io/v1/QW6tYBRenqUwP8d9ZJds44Dm-txH1497oDXcdC07xDo'
    //soroban: 'https://soroban-mainnet.nownodes.io/32b582fb-d83b-44fc-8788-774de28395cb'
    //soroban: 'https://small-shy-borough.stellar-mainnet.quiknode.pro/53e6763ed40e4bc3202a8792d6d2d51706052755/'
  },
  futurenet: {
    name: 'futurenet',
    passphrase: 'Test SDF Future Network ; October 2022',
    horizon: 'https://horizon-futurenet.stellar.org',
    soroban: 'https://rpc-futurenet.stellar.org'
  },
  testnet: {
    name: 'testnet',
    passphrase: 'Test SDF Network ; September 2015',
    horizon: 'https://horizon-testnet.stellar.org',
    soroban: 'https://soroban-testnet.stellar.org'
  }
}

export default class Wallet {
  neturl     = ''
  explorer   = ''
  network    = ''
  netinfo    = {}
  chainId    = '0x0'
  accounts?:[string] = undefined
  myaccount:string  = ''
  horizon?:any = null
  horizonurl = networks[process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK||'testnet'].horizon || ''
  provider   = null
  
  constructor() {
    console.log('FREIGHT INIT')
  }

  async init() {
    //console.log('INIT...')
    if(await isConnected()){
      return {success:true}
    } else {
      return {success:false}
    }
  }

  async connect() {
    try {
      console.log('CONNECT...', this.horizonurl)
      this.horizon = new StellarSDK.Horizon.Server(this.horizonurl || '')
      const access = await requestAccess()
      this.myaccount = access?.address
      const net = await getNetwork()
      console.log('NET', net)
      this.network = net?.network.toLowerCase()
      this.netinfo = await getNetworkDetails()
      console.log('FNET', this.network)
      console.log('FINF', this.netinfo)
      return {success:true, account:this.myaccount, network:this.network}
    } catch(ex) {
      console.error(ex)
      return {success:false, account:'', network:''}
    }
  }

  async payment(dst:string, amt:string, memo:string) {
    try {
      let nwk = (process.env.NEXT_PUBLIC_STELLAR_NETWORK||'').toUpperCase()
      let net = (process.env.NEXT_PUBLIC_STELLAR_PASSPHRASE||'')
      console.log('NET:', nwk, net)
      //let pub = process.env.NEXT_PUBLIC_NFT_ISSUER
      let pub = this.myaccount
      console.log('From', pub)
      console.log('Paying', amt, 'XLM to', dst, 'Memo', memo)
      let act = await this.horizon.loadAccount(pub)
      let fee = await this.horizon.fetchBaseFee() // 100
      let opr = StellarSDK.Operation.payment({
       destination: dst,
       amount: amt,
       asset: StellarSDK.Asset.native()
      })
      const opt = { fee, network:nwk, networkPassphrase:net }
      let txn = new StellarSDK.TransactionBuilder(act, opt)
       //.setNetworkPassphrase(net)
       .addOperation(opr)
       .setTimeout(30)
      if(memo) { txn.addMemo(StellarSDK.Memo.text(memo)) }
      const built = txn.build()
      const txid  = built.hash().toString('hex')
      const xdr   = built.toXDR()
      console.log('XDR:', xdr)
      const sgn   = await signTransaction(xdr, {networkPassphrase:net})
      console.log('SGN:', sgn)
      //const env   = StellarSDK.xdr.Transaction.fromXDR(sgn, 'base64')
      //const env   = StellarSDK.xdr.TransactionEnvelope.fromXDR(sgn, 'base64')
      //console.log('ENV:', env)
      //const env = JSON.stringify(StellarSDK.xdr.TransactionEnvelope.fromXDR(sgn, 'base64'))
      //const env = StellarSDK.xdr.TransactionResult.fromXDR(xdr, 'base64')
      //const env = StellarSDK.xdr.TransactionMeta.fromXDR(xdr, 'base64')
      //console.log('ENX:', JSON.stringify(env))
      //const final = await this.submit(env)
      //const txs = new StellarSDK.Transaction(sgn)
      //console.log('TXS', txs)

      //const txs = new StellarSDK.TransactionBuilder.fromXDR(sgn, this.horizonurl)
      const txs = StellarSDK.TransactionBuilder.fromXDR(sgn.signedTxXdr, net)
      console.log('TXS', txs)
      const result = await this.horizon.submitTransaction(txs)
      console.log('RES', result)
      //console.log("hash:", result.hash);
      //console.log("status:", result.status);
      //console.log("errorResultXdr:", result.errorResultXdr)
      if(result?.successful){
        return {success:true, result, txid, address:this.myaccount}
      } else {
        return {success:false, error:'Payment rejected by user', result, txid}
      }
    } catch(err) {
      console.error('E>>', err)
      return {success:false, error:err}
    }
  }

  async fetchLedger(query:string){
    try {
      let url = this.horizon + query
      console.log('FETCH', url)
      let options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
      let result = await fetch(url, options)
      let data = await result.json()
      return data
    } catch (ex:any) {
      console.error(ex)
      return { error: ex?.message }
    }
  }

  async getTransactionInfo(txid: string){
    console.log('Get tx info by txid', txid);
    let txInfo = await this.fetchLedger('/transactions/'+txid)
    if (!txInfo || 'error' in txInfo) {
      console.log('ERROR', 'Transaction not found:', txid)
      return { error: 'Transaction not found' }
    }
    if (!txInfo?.successful) {
      console.log('ERROR', 'Transaction not valid')
      return { error: 'Transaction not valid' }
    }
    console.log('TXINFO', txInfo)
    const tag = txInfo.memo?.indexOf(':')>0 ? txInfo.memo?.split(':')[1] : ''
    const opid = (BigInt(txInfo.paging_token)+BigInt(1)).toString()
    const opInfo = await this.fetchLedger('/operations/'+opid)
    const result = {
      success: true,
      account: txInfo.source_account,
      amount: opInfo?.amount,
      destination: opInfo?.to,
      destinationTag: tag
    }
    return result
  }

}