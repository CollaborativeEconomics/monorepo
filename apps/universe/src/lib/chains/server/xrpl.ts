import { WalletProvider } from '@/types/wallet'
import { Wallet, Client, convertStringToHex, NFTokenMintFlags, isoTimeToRippleTime, NFTokenCreateOfferFlags, NFTokenCreateOffer, Transaction, TransactionMetadata } from 'xrpl'

type Dictionary = { [key:string]:any }
type Callback = (data:Dictionary)=>void

class RippleServer {
  chain    = 'XRPL'
  coinSymbol   = 'XRP'
  network  = process.env.NEXT_PUBLIC_XRPL_NETWORK
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

  constructor(){
    this.provider = this.network=='mainnet' ? this.mainnet : this.testnet
  }

  toWei(num:number){
    const wei = 10**this.provider.decimals
    return num * wei
  }

  fromWei(num:number){
    const wei = 10**this.provider.decimals
    return num / wei
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
    console.log(this.chain, 'Sending payment to', address, amount)
    // no payments on the server
    callback({success:false, txid:''})
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
  async mintNFT(uri: string, donor: string, taxon: number, transfer: boolean = false) {
    console.log('XRP Minting NFT...', uri, donor)
    let client = null
    let sourceTag = parseInt(process.env.XRPL_SOURCE_TAG || '77777777')
    if(!taxon){ taxon = 123456000 }
    try {
      let wallet = Wallet.fromSeed(process.env.XRPL_MINTER_WALLET_SEED || '')
      let account = wallet.classicAddress
      console.log('ADDRESS', account)
      let nftUri = convertStringToHex(uri)
      let flags = NFTokenMintFlags.tfBurnable + NFTokenMintFlags.tfOnlyXRP
      if(transfer) { flags += NFTokenMintFlags.tfTransferable }
      let tx:Transaction = {
        TransactionType: 'NFTokenMint',
        Account: account,
        URI: nftUri,          // uri to metadata
        NFTokenTaxon: taxon,  // id for all nfts minted by us
        Flags: flags,         // burnable, onlyXRP, non transferable
        SourceTag: sourceTag, // 77777777
      }
      //if(destinTag){ tx.DestinationTag = destinTag }
      console.log('TX', tx)
      client = new Client(this.provider.wssurl||'')
      await client.connect()
      let txInfo = await client.submitAndWait(tx, { wallet })
      const txRes = (txInfo?.result?.meta as TransactionMetadata).TransactionResult
      console.log('Result:', txRes)
      if (txRes == 'tesSUCCESS') {
        //console.log('TXINFO', JSON.stringify(txInfo))
        let tokenId = this.findToken(txInfo)
        console.log('TokenId:', tokenId)
        return {success: true, tokenId}
      }
    } catch (ex:any) {
      console.error(ex)
      return { success: false, error: 'Error minting NFT: '+ex?.message||'unknown' }
    } finally {
      client?.disconnect()
    }
  }

  // Creates a sell offer
  //   tokenId: nft that will be offered
  //   destinAcct: address that will approve the offer
  //   expires: optional date if offer will expire
  async createSellOffer(tokenId: string, destinationAddress: string, offerExpirationDate?: string) {
    console.log('XRP Sell offer', tokenId, destinationAddress)
    let client = null
    try {
      console.log('SEED', process.env.XRPL_MINTER_WALLET_SEED)
      let wallet = Wallet.fromSeed(process.env.XRPL_MINTER_WALLET_SEED || '')
      let account = wallet.classicAddress
      console.log('ACT', account)
      let tx:Transaction = {
        TransactionType: 'NFTokenCreateOffer',
        Account: account,
        NFTokenID: tokenId,
        Destination: destinationAddress,
        Amount: '0',  // Zero price as it is a transfer
        Flags: NFTokenCreateOfferFlags.tfSellNFToken // sell offer
      } as NFTokenCreateOffer
      if (offerExpirationDate) {
        tx.Expiration = isoTimeToRippleTime(offerExpirationDate) // must be Ripple epoch
      }
      console.log('TX', tx)
      console.log('WSS', this.provider.wssurl)
      client = new Client(this.provider.wssurl||'')
      await client.connect()
      let txInfo = await client.submitAndWait(tx, { wallet })
      const txRes = (txInfo?.result?.meta as TransactionMetadata).TransactionResult
      console.log('Result:', txRes)
      if (txRes == 'tesSUCCESS') {
        let offerId = this.findOffer(txInfo)
        console.log('OfferId', offerId)
        return { success:true, offerId }
      } else {
        return { error: 'Failure creating sell offer' }
      }
    } catch (ex) {
      console.error(ex)
      return { error: 'Error creating sell offer' }
    } finally {
      client?.disconnect()
    }
  }

/*
  async acceptSellOffer(offerId, address, callback) {
    console.log('Client XRP Accept sell offer...', offerId, address)
    const request:XummJsonTransaction = {
      TransactionType: 'NFTokenAcceptOffer',
      NFTokenSellOffer: offerId,
      Account: address
    }
    this.sendPayload(request, callback)
  }

  async sendPayload(request, callback){
    console.log('REQUEST', request)
    this.wallet.payload.createAndSubscribe(request, (event) => {
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
    }).catch((ex) => {
      console.log('ERROR', ex)
      callback({success:false, txid:'', error:'Error sending payment: '+ex})
    })
    // This is where you can do `xumm.payload.get(...)` to fetch details
    console.log('----DONE')
  }
*/

  // After minting a token, parses the tx response to get the last token Id
  // Loops all affected nodes looking for a token in final fields but not in previous
  // If a node is found, that's the token Id freshly minted
  // Else returns null
  findToken(txInfo:any){
    let found = null
    for (var i=0; i<txInfo.result.meta.AffectedNodes.length; i++) {
      let node = txInfo.result.meta.AffectedNodes[i]
      if(node.ModifiedNode && node.ModifiedNode.LedgerEntryType=='NFTokenPage'){
        let m = node.ModifiedNode.FinalFields.NFTokens.length
        let n = node.ModifiedNode.PreviousFields.NFTokens.length
        for (var j=0; j<m; j++) {
          let tokenId = node.ModifiedNode.FinalFields.NFTokens[j].NFToken.NFTokenID
          found = tokenId
          for (var k=0; k<n; k++) {
            if(tokenId==node.ModifiedNode.PreviousFields.NFTokens[k].NFToken.NFTokenID){
              found = null
              break
            }
          }
          if(found){ break }
        }
      }
      if(found){ break }
    }
    return found
  }

  // After creating a sell offer, parses the tx response to get the offer Id
  // Loops all affected nodes looking for an offer
  // If a NFTokenOffer is found, that's the offer Id
  // Else returns null
  findOffer(txInfo: any){
    for (var i = 0; i < txInfo.result.meta.AffectedNodes.length; i++) {
      let node = txInfo.result.meta.AffectedNodes[i]
      if(node.CreatedNode && node.CreatedNode.LedgerEntryType=='NFTokenOffer'){
        return node.CreatedNode.LedgerIndex
      }
    }
  }

/*
  async getAccountNFTs(account: string) {
    console.log({ account })
    let txInfo = await this.fetchApi({
      method: 'account_nfts',
      params: [
        {
          account: account,
          ledger_index: 'validated'
        }
      ]
    })
    if (!txInfo || 'error' in txInfo) {
      console.log('ERROR', 'Account not found:', { account })
      return { error: 'Account not found' }
    }
    console.log('NFTs', txInfo)
    return txInfo?.result?.account_nfts
  }
*/
}

const XRPL = new RippleServer()

export default XRPL