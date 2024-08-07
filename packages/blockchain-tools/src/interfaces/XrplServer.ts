import {
  Client,
  type NFTokenCreateOffer,
  NFTokenCreateOfferFlags,
  NFTokenMintFlags,
  type Transaction,
  type TransactionMetadata,
  Wallet,
  convertStringToHex,
  isoTimeToRippleTime,
} from "xrpl"
import { ChainBaseClass } from "../chains"
import type { ChainSlugs, Network } from "../chains/chainConfig"
import XrplCommon from "./XrplCommon"

export default class XrplServer extends XrplCommon {
  sourceTag?: number
  constructor(slug: ChainSlugs, network: Network, sourceTag?: number) {
    super(slug, network)
    this.sourceTag = sourceTag
  }

  async mintNFT({
    uri,
    address,
    taxon,
    transfer = false,
    walletSeed,
  }: {
    uri: string
    address: string
    taxon?: number
    transfer?: boolean
    walletSeed: string
  }): Promise<{ success: boolean; tokenId?: string; error?: string }> {
    console.log("XRP Minting NFT...", uri, address)
    let client = null
    if (!taxon) {
      taxon = 123456000
    }
    try {
      const wallet = Wallet.fromSeed(walletSeed)
      const account = wallet.classicAddress
      console.log("ADDRESS", account)
      const nftUri = convertStringToHex(uri)
      let flags = NFTokenMintFlags.tfBurnable + NFTokenMintFlags.tfOnlyXRP
      if (transfer) {
        flags += NFTokenMintFlags.tfTransferable
      }
      const tx: Transaction = {
        TransactionType: "NFTokenMint",
        Account: account,
        URI: nftUri, // uri to metadata
        NFTokenTaxon: taxon, // id for all nfts minted by us
        Flags: flags, // burnable, onlyXRP, non transferable
        SourceTag: this.sourceTag, // 77777777
      }
      //if(destinTag){ tx.DestinationTag = destinTag }
      console.log("TX", tx)
      client = new Client(this.network.wssurl || "")
      await client.connect()
      const txInfo = await client.submitAndWait(tx, { wallet })
      const txRes = (txInfo?.result?.meta as TransactionMetadata)
        .TransactionResult
      console.log("Result:", txRes)
      if (txRes === "tesSUCCESS") {
        //console.log('TXINFO', JSON.stringify(txInfo))
        const tokenId = this.findToken(txInfo)
        console.log("TokenId:", tokenId)
        if (typeof tokenId !== "string") {
          return { success: false, error: tokenId.error }
        }
        return { success: true, tokenId }
      }
    } catch (ex) {
      console.error(ex)
      if (ex instanceof Error) {
        return {
          success: false,
          error: `Error minting NFT: ${ex.message}`,
        }
      }
      return {
        success: false,
        error: "unknown",
      }
    } finally {
      client?.disconnect()
    }
    return { success: false, error: "Error minting NFT" }
  }

  async createSellOffer({
    tokenId,
    destinationAddress,
    offerExpirationDate,
    walletSeed,
  }: {
    tokenId: string
    destinationAddress: string
    offerExpirationDate?: string
    walletSeed: string
  }): Promise<{ success: boolean; offerId?: string; error?: string }> {
    console.log("XRP Sell offer", tokenId, destinationAddress)
    let client = null
    try {
      const wallet = Wallet.fromSeed(walletSeed)
      const account = wallet.classicAddress
      console.log("ACT", account)
      const tx: Transaction = {
        TransactionType: "NFTokenCreateOffer",
        Account: account,
        NFTokenID: tokenId,
        Destination: destinationAddress,
        Amount: "0", // Zero price as it is a transfer
        Flags: NFTokenCreateOfferFlags.tfSellNFToken, // sell offer
      } as NFTokenCreateOffer
      if (offerExpirationDate) {
        tx.Expiration = isoTimeToRippleTime(offerExpirationDate) // must be Ripple epoch
      }
      console.log("TX", tx)
      console.log("WSS", this.network.wssurl)
      client = new Client(this.network.wssurl || "")
      await client.connect()
      const txInfo = await client.submitAndWait(tx, { wallet })
      const txRes = (txInfo?.result?.meta as TransactionMetadata)
        .TransactionResult
      console.log("Result:", txRes)
      if (txRes === "tesSUCCESS") {
        const offerId = this.findOffer(txInfo)
        console.log("OfferId", offerId)
        if (typeof offerId !== "string") {
          return { success: false, error: offerId.error }
        }
        return { success: true, offerId }
      }
      return { success: false, error: "Failure creating sell offer" }
    } catch (ex) {
      console.error(ex)
      return { success: false, error: "Error creating sell offer" }
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
      console.log('Payload QR:', payload?.created.refs.qr.svg)
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
