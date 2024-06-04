import { Wallet, Client, convertStringToHex, NFTokenMintFlags, isoTimeToRippleTime, NFTokenCreateOfferFlags, NFTokenCreateOffer } from 'xrpl'
import { WalletProvider } from '@/types/wallet'
import { Xumm } from 'xumm'
import type { ResolvedFlow } from 'xumm-oauth2-pkce'
import type { XummJsonTransaction, XummPostPayloadBodyJson, PayloadAndSubscription } from 'xumm-sdk/dist/src/types'
import { findOffer, findToken } from '@/lib/chains/xrpl-utils'


type Dictionary = { [key:string]:any }
type Callback = (data:Dictionary)=>void
type IError = (error: Error) => void
type State = ResolvedFlow|Error|undefined

const apikey = process.env.NEXT_PUBLIC_XUMM_API_KEY || ''
const secret = process.env.XUMM_API_SECRET || ''
//console.log('XUMM', apikey, secret)

class RippleSDK{
  chainEnabled  = true
  chain    = 'XRPL'
  coinSymbol   = 'XRP'
  logo     = 'xrp.png'
  network  = process.env.NEXT_PUBLIC_XRPL_NETWORK || ''
  provider:WalletProvider
  mainnet  = {
    id: 0,
    name: 'XRPL Mainnet',
    coinSymbol: 'XRP',
    decimals: 6,
    gasprice: '250000000',
    explorer: 'https://livenet.xrpl.org',
    rpcurl: 'https://s1.ripple.com:51234',
    wssurl: 'wss://s1.ripple.com'
  }
  testnet  = {
    id: 0,
    name: 'XRPL Testnet',
    coinSymbol: 'XRP',
    decimals: 6,
    gasprice: '250000000',
    explorer: 'https://testnet.xrpl.org',
    rpcurl: 'https://s.altnet.rippletest.net:51234',
    wssurl: 'wss://s.altnet.rippletest.net:51233'
  }
  wallet:Xumm

  constructor(){
    this.provider = this.network=='mainnet' ? this.mainnet : this.testnet
    this.wallet = new Xumm(apikey, secret)
  }

  toWei(num:number){
    const sats = 10**this.provider.decimals
    return num / sats
  }

  async connect(callback:Callback){
    console.log('XRP Connecting...')
    this.wallet.authorize().then((state) => {
      console.log('Xumm Authorized', state)
      if(!state){
        console.log('Error: no state')
        return
      }
      if('me' in state){
        const flow = state
        const user = state.me
        const address = user.account
        //const network = user.networkType.toLowerCase()
        const network = 'testnet'
        const token   = flow.jwt
        const data = {
          wallet:   'xumm',
          address:  address,
          chain:    this.chain,
          chaindid: '',
          currency: this.coinSymbol,
          network:  network,
          token:    token,
          topic:    ''
        }
        callback(data)
      } else {
        console.log('Error', state)
        callback({error:'Could not connect'})
      }
    }).catch((ex:any)=>{
      console.log('Error', ex)
      callback({error:ex.message})
    })
  }

  async fetchLedger(payload:any){
    try {
      let url = this.provider.rpcurl
      let options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
      let result = await fetch(url, options)
      let data = await result.json()
      return data
    } catch (ex:any) {
      console.error(ex)
      return { error: ex.message }
    }
  }

  async sendPayment(address:string, amount:string, destinTag:string, callback:any){
    console.log('XRP Sending payment...', address, amount, destinTag)
    try {
      const request:XummJsonTransaction = {
        TransactionType: 'Payment',
        Destination: address,
        Amount: String(parseFloat(amount)*1000000) // one million drops, 1 XRP
      }
      if(destinTag) { request.DestinationTag = destinTag }
      //this.sendPayload(request, callback)
      if(!this.wallet) { callback({success:false, txid:''}); return }
      this?.wallet?.payload?.createAndSubscribe(request, (event) => {
        if (Object.keys(event.data).indexOf('opened') > -1) {
          // Update the UI? The payload was opened.
          console.log('OPENED')
        }
        if (Object.keys(event.data).indexOf('signed') > -1) {
          // The `signed` property is present, true (signed) / false (rejected)
          console.log('SIGNED', event.data.signed)
          return event
        }
      }).then((payload:any) => {
        console.log('CREATED', payload)
        // @ts-ignore: I hate types
        console.log('Payload URL:', payload?.created.next.always)
        // @ts-ignore: I hate types
        console.log('Payload QR:', payload?.created.refs.qr_png)
        // @ts-ignore: I hate types
        return payload.resolved // Return payload promise for the next `then`
      }).then((payload:any) => {
        console.log('RESOLVED')
        console.log('Payload resolved', payload)
        if (Object.keys(payload.data).indexOf('signed') > -1) {
          const approved = payload.data.signed
          console.log(approved ? 'APPROVED' : 'REJECTED')
          if(approved){
            callback({success:true, txid:payload.data.txid})
          } else {
            callback({success:false, txid:''})
          }
        }
      }).catch((ex:any) => {
        console.log('ERROR', ex)
        callback({success:false, txid:'', error:'Error sending payment: '+ex})
      })
      // This is where you can do `xumm.payload.get(...)` to fetch details
      console.log('----DONE')
    } catch(ex:any) {
      console.error(ex)
      callback({error:ex.message})
    }
  }

  async acceptSellOffer(offerId:string, address:string, callback:any) {
    console.log('XRP Accept sell offer...', offerId, address)
    const request:XummJsonTransaction = {
      TransactionType: 'NFTokenAcceptOffer',
      NFTokenSellOffer: offerId,
      Account: address
    }
    this.sendPayload(request, callback)
  }

  async sendPayload(request:XummJsonTransaction, callback:any){
    console.log('REQUEST', request)
    if(!this.wallet) { callback({success:false, txid:''}); return }
    this?.wallet?.payload?.createAndSubscribe(request, (event) => {
      if (Object.keys(event.data).indexOf('opened') > -1) {
        // Update the UI? The payload was opened.
        console.log('OPENED')
      }
      if (Object.keys(event.data).indexOf('signed') > -1) {
        // The `signed` property is present, true (signed) / false (rejected)
        console.log('SIGNED', event.data.signed)
        return event
      }
    }).then(payload => {
      console.log('CREATED', payload)
      // @ts-ignore: I hate types
      console.log('Payload URL:', payload?.created.next.always)
      // @ts-ignore: I hate types
      console.log('Payload QR:', payload?.created.refs.qr_png)
      // @ts-ignore: I hate types
      return payload.resolved // Return payload promise for the next `then`
    }).then((payload) => {
      console.log('RESOLVED')
      console.log('Payload resolved', payload)
      if (Object.keys(payload.data).indexOf('signed') > -1) {
        const approved = payload.data.signed
        console.log(approved ? 'APPROVED' : 'REJECTED')
        if(approved){
          callback({success:true, txid:payload.data.txid})
        } else {
          callback({success:false, txid:''})
        }
      }
    }).catch((ex:any) => {
      console.log('ERROR', ex)
      callback({success:false, txid:'', error:'Error sending payment: '+ex})
    })
    // This is where you can do `xumm.payload.get(...)` to fetch details
    console.log('----DONE')
  }

  async getTransactionInfo(txid:string){
    console.log('Get tx info by txid', txid)
    const txResponse = await this.fetchLedger({
      method: 'tx',
      params: [
        {
          transaction: txid,
          binary: false
        }
      ]
    })
    if (!txResponse || 'error' in txResponse) {
      console.log('ERROR: Exception occured while retrieving transaction info', txid)
      return { error: 'Exception occured while retrieving transaction info' }
    }
    if (
      txResponse?.result?.validated === undefined &&
      txResponse?.result?.validated
    ) {
      console.log('ERROR', 'Transaction is not validated on ledger')
      return { error: 'Transaction is not validated on ledger' }
    }
    //console.log('TXINFO', txResponse)
    const result = {
      success: true,
      account: txResponse.result.Account,
      amount: txResponse.result.Amount > 0 ? txResponse.result.Amount / 1000000 : txResponse.result.Amount,
      destination: txResponse.result.Destination,
      destinationTag: txResponse.result.DestinationTag
    }
    return result
  }

  // Mints NFT and returns tokenId
  //   uri: uri to metadata
  //   taxon: same id for all similar nfts
  async mintNFT(uri: string, taxon: number, transfer: boolean = false) {
    console.log('XRP Minting NFT...')
    let client = null
    let sourceTag = parseInt(process.env.RIPPLE_SOURCE_TAG || '77777777')
    try {
      let wallet = Wallet.fromSeed(process.env.RIPPLE_MINTER_WALLET_SEED||'')
      let account = wallet.classicAddress
      console.log('ADDRESS', account)
      let nftUri = convertStringToHex(uri)
      let flags = NFTokenMintFlags.tfBurnable + NFTokenMintFlags.tfOnlyXRP
      if(transfer) { flags += NFTokenMintFlags.tfTransferable }
      let tx:any = {
        TransactionType: 'NFTokenMint',
        Account: account,
        URI: nftUri,          // uri to metadata
        NFTokenTaxon: taxon,  // id for all nfts minted by us
        Flags: flags,         // burnable, onlyXRP, non transferable
        SourceTag: sourceTag, // 77777777
      }
      //if(destinTag){ tx.DestinationTag = destinTag }
      console.log('TX', tx)
      client = new Client(this?.provider?.wssurl || '')
      await client.connect()
      let txInfo = await client.submitAndWait(tx, { wallet })
      console.log('Result:', txInfo?.result?.meta?.TransactionResult)
      if (txInfo?.result?.meta?.TransactionResult == 'tesSUCCESS') {
        //console.log('TXINFO', JSON.stringify(txInfo))
        let tokenId = findToken(txInfo)
        console.log('TokenId:', tokenId)
        return {success: true, tokenId}
      }
    } catch (ex:any) {
      console.error(ex)
      return { success: false, error: 'Error minting NFT: '+ex.message }
    } finally {
      client?.disconnect()
    }
  }

  async createSellOffer(tokenId: string, destinationAddress: string, offerExpirationDate?: string) {
    console.log('XRP Sell offer', tokenId, destinationAddress)
    return { error: 'Not implemented in client' }
  }
}

const XRPL = new RippleSDK()

export default XRPL