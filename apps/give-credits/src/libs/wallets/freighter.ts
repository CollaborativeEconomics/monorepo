import appConfig from "@cfce/app-config"
import { chainConfig, getRpcUrl } from "@cfce/blockchain-tools"
import {
  getNetwork,
  getNetworkDetails,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api"
import * as StellarSDK from "@stellar/stellar-sdk"

export default class Wallet {
  neturl = ""
  explorer = ""
  network = ""
  netinfo = {}
  chainId = "0x0"
  accounts?: [string] = undefined
  myaccount = ""
  horizon?: StellarSDK.Horizon.Server
  horizonurl = getRpcUrl(
    "stellar",
    appConfig.chains.stellar?.network ?? appConfig.chainDefaults.network,
    "horizon",
  )
  provider = null

  constructor() {
    console.log("FREIGHT INIT")
  }

  async init() {
    //console.log('INIT...')
    if (await isConnected()) {
      return { success: true }
    }
    return { success: false }
  }

  async connect() {
    try {
      console.log("CONNECT...")
      this.horizon = new StellarSDK.Horizon.Server(this.horizonurl || "")
      const account = await requestAccess()
      if ("error" in account) {
        throw new Error(`Freighter access failed: ${account.error}`)
      }
      this.myaccount = account.address
      this.network = ((await getNetwork()) || "").network.toLowerCase()
      this.netinfo = await getNetworkDetails()
      console.log("FNET", this.network)
      console.log("FINF", this.netinfo)
      return { success: true, account: this.myaccount, network: this.network }
    } catch (ex) {
      console.error(ex)
      return { success: false, account: "", network: "" }
    }
  }

  async sendPayment(dst: string, amt: string, memo: string) {
    try {
      const network =
        appConfig.chains.stellar?.network ?? appConfig.chainDefaults.network
      const networkPassphrase =
        chainConfig.stellar.networks[
          network as keyof typeof chainConfig.stellar
        ].networkPassphrase ?? ""
      console.log("NET:", network, networkPassphrase)
      //let pub = process.env.NEXT_PUBLIC_NFT_ISSUER
      const pub = this.myaccount
      console.log("From", pub || '???')
      console.log("Paying", amt, "XLM to", dst, "Memo", memo || '[nomemo]')
      if (!this.horizon) {
        throw new Error("Horizon server not initialized")
      }
      const act = await this.horizon.loadAccount(pub)
      const fee = await this.horizon.fetchBaseFee() // 100
      const opr = StellarSDK.Operation.payment({
        destination: dst,
        amount: amt,
        asset: StellarSDK.Asset.native(),
      })
      const opt = {
        fee: `${fee}`,
        network: network.toUpperCase(),
        networkPassphrase,
      }
      const txn = new StellarSDK.TransactionBuilder(act, opt)
        //.setNetworkPassphrase(networkPassphrase)
        .addOperation(opr)
        .setTimeout(30)
      if (memo) {
        txn.addMemo(StellarSDK.Memo.text(memo))
      }
      const built = txn.build()
      const txid = built.hash().toString("hex")
      const xdr = built.toXDR()
      console.log("XDR:", xdr)
      const sgn = await signTransaction(xdr, { networkPassphrase })
      console.log("SGN:", sgn)
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
      const txs = StellarSDK.TransactionBuilder.fromXDR(
        sgn.signedTxXdr,
        network.toUpperCase(),
      )
      console.log("TXS", txs)
      const result = await this.horizon.submitTransaction(txs)
      console.log("RES", result)
      //console.log("hash:", result.hash);
      //console.log("status:", result.status);
      //console.log("errorResultXdr:", result.errorResultXdr)
      if (result?.successful) {
        return { success: true, result, txid, address: this.myaccount }
      }
      return {
        success: false,
        error: "Payment rejected by user",
        result,
        txid,
      }
    } catch (err) {
      console.error("E>>", err)
      return { success: false, error: err }
    }
  }

  async fetchLedger(query: string) {
    try {
      const url = this.horizon + query
      console.log("FETCH", url)
      const options = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
      const result = await fetch(url, options)
      const data = await result.json()
      return data
    } catch (ex) {
      console.error(ex)
      return { error: ex instanceof Error ? ex.message : "Unknown error" }
    }
  }

  async getTransactionInfo(txid: string) {
    console.log("Get tx info by txid", txid)
    const txInfo = await this.fetchLedger(`/transactions/${txid}`)
    if (!txInfo || "error" in txInfo) {
      console.log("ERROR", "Transaction not found:", txid)
      return { error: "Transaction not found" }
    }
    if (!txInfo?.successful) {
      console.log("ERROR", "Transaction not valid")
      return { error: "Transaction not valid" }
    }
    console.log("TXINFO", txInfo)
    const tag = txInfo.memo?.indexOf(":") > 0 ? txInfo.memo?.split(":")[1] : ""
    const opid = (BigInt(txInfo.paging_token) + BigInt(1)).toString()
    const opInfo = await this.fetchLedger(`/operations/${opid}`)
    const result = {
      success: true,
      account: txInfo.source_account,
      amount: opInfo?.amount,
      destination: opInfo?.to,
      destinationTag: tag,
    }
    return result
  }
}
