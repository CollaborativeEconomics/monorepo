import Wallet from '@/lib/wallets/freighter'
import { WalletProvider } from '@/types/wallet'

type Dictionary = { [key:string]:any }
type Callback = (data:Dictionary)=>void

class StellarClass{
  chainEnabled  = true
  chain    = 'Stellar'
  coinSymbol   = 'XLM'
  logo     = 'xlm.png'
  network  = process.env.NEXT_PUBLIC_STELLAR_NETWORK || ''
  provider:WalletProvider
  mainnet  = {
    id: 0,
    name: 'Stellar Mainnet',
    coinSymbol: 'XLM',
    decimals: 6,
    gasprice: '250000000',
    explorer: '',
    rpcurl: 'https://horizon.stellar.org',
    wssurl: ''
  }
  testnet  = {
    id: 0,
    name: 'Stellar Testnet',
    coinSymbol: 'XLM',
    decimals: 6,
    gasprice: '250000000',
    explorer: '',
    rpcurl: 'https://horizon-testnet.stellar.org',
    wssurl: ''
  }
  futurenet  = {
    id: 0,
    name: 'Stellar Futurenet',
    coinSymbol: 'XLM',
    decimals: 6,
    explorer: '',
    rpcurl: 'https://horizon-futurenet.stellar.org',
    wssurl: ''
  }
  wallet:Wallet

  constructor(){
    this.provider = this.network=='mainnet' ? this.mainnet : this.testnet
    this.wallet = new Wallet()
  }

  toWei(num:number){
    const wei = 10**this.provider.decimals
    return num * wei
  }

  fromWei(num:number){
    const wei = 10**this.provider.decimals
    return num / wei
  }

  async fetchLedger(query:any){
    try {
      let url = this.provider.rpcurl + query
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
      return { error: ex.message }
    }
  }

  async connect(callback:Callback){
    console.log('XLM Connecting...')
    const result = await this.wallet.connect()
    console.log('Freighter session:', result)
    if(result){
      const address = result.account
      const network = result.network
      const topic   = '' //result.topic
      const data = {
        wallet:   'freighter',
        address:  address,
        chain:    this.chain,
        chaindid: '',
        currency: this.coinSymbol,
        network:  network,
        token:    '',
        topic:    topic
      }
      callback(data)
    } else {
      callback(result)
    }
  }
/*
  async paymentXDR(source, destin, amount, currency, issuer, memo='') {
    console.log('PAYMENT', source, destin, amount, currency, issuer, memo)
    const server = new StellarSdk.Server(this.provider.rpcurl)
    const account = await server.loadAccount(source)
    //const baseFee = await server.fetchBaseFee()
    //const network = StellarSdk.Networks.PUBLIC
    const network = (this.network=='mainnet' ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET)
    const operation = StellarSdk.Operation.payment({
      destination: destin,
      amount: amount,
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
*/
  async sendPayment(address:string, amount:string, destinTag:string, callback:any){
    console.log(this.chain, 'Sending payment to', address, amount)
    try {
      const connect = await this.wallet.connect()
      console.log('Wallet restored...', connect)
      const source = connect?.account
      console.log('SOURCE', source)
      if(!source){
        console.log('Error: Signature rejected by user')
        callback({success:false, error:'Signature rejected by user'})
        return
      }
      const currency = this.coinSymbol
      const issuer = ''
      const memo = destinTag ? 'tag:'+destinTag : ''
      //const {txid, xdr} = await this.paymentXDR(source, address, amount, currency, issuer, memo)
      //console.log('txid', txid)
      //this.wallet.signAndSubmit(xdr, async result=>{
      //  console.log('UI RESULT', result)
      //  if(result?.error){
      //    console.log('Error', result.error)
      //    callback({success:false, error:'Error sending payment'})
      //    return
      //  }
      //  console.log('Result', result)
      //  callback({success:true, txid})
      //})
      const result = await this.wallet.payment(address, amount, memo)
      callback(result)
    } catch(ex:any) {
      console.error(ex)
      callback({error:ex.message})
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

const Stellar = new StellarClass()

export default Stellar