import type {
  ChainConfig,
  ChainSlugs,
  Network,
  NetworkConfig,
} from "@cfce/types"
import {
  getNetwork,
  getNetworkDetails,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api"
import * as StellarSDK from "@stellar/stellar-sdk"
import { getNetworkForChain } from "../chains/BlockchainInterfaces"
import InterfaceBaseClass from "../chains/InterfaceBaseClass"
import chainConfiguration from "../chains/chainConfig"

class FreighterWallet extends InterfaceBaseClass {
  network: NetworkConfig
  chain: ChainConfig

  horizon: StellarSDK.Horizon.Server
  horizonConfig = {
    network: "",
    netinfo: {},
  }
  connectedWallet = ""

  constructor() {
    super()
    this.network = getNetworkForChain("stellar")
    this.chain = chainConfiguration.stellar
    this.horizon = new StellarSDK.Horizon.Server(this.network.rpcUrls.main)
    //console.log("FREIGHT INIT")
    //console.log("RPC", this.network)
  }

  async init() {
    if (await isConnected()) {
      return { success: true }
    }
    return { success: false }
  }

  async connect() {
    try {
      console.log("CONNECT...")
      this.connectedWallet = await (await requestAccess()).address
      this.horizonConfig.network = (
        (await getNetwork()).network || ""
      ).toLowerCase()
      this.horizonConfig.netinfo = await getNetworkDetails()
      console.log("FNET", this.network)
      return {
        success: true,
        walletAddress: this.connectedWallet,
        network: this.network,
        chain: this.chain.slug,
      }
    } catch (ex) {
      console.error(ex)
      return { success: false, error: ex instanceof Error ? ex.message : "" }
    }
  }

  async sendPayment({
    address,
    amount,
    memo,
  }: { address: string; amount: number; memo: string }) {
    try {
      console.log("From", this.connectedWallet || "???")
      console.log("Paying", amount, "XLM to", address, "Memo", memo || "[no]")
      const act = await this.horizon.loadAccount(this.connectedWallet)
      //const fee = 5000
      const fee = await this.horizon.fetchBaseFee() // 100
      const xlm = amount.toString()
      const data = {
        destination: address,
        //amount: `${amount}`,
        amount: xlm, // Stellar sends XLM as whole, not stroops
        asset: StellarSDK.Asset.native(),
      }
      const opr = StellarSDK.Operation.payment(data)
      const opt = {
        fee: `${fee}`,
        network: this.network.rpcUrls.main,
        networkPassphrase: this.network.networkPassphrase,
      }
      console.log("OPR:", data)
      console.log("OPT:", opt)
      const txn = new StellarSDK.TransactionBuilder(act, opt)
        //.setNetworkPassphrase(this.network.networkPassphrase)
        .addOperation(opr)
        .setTimeout(30)
      if (memo) {
        txn.addMemo(StellarSDK.Memo.text(memo))
      }
      const built = txn.build()
      const txid = built.hash().toString("hex")
      const xdr = built.toXDR()
      console.log("XDR:", xdr)
      const sgn = await signTransaction(xdr, {
        networkPassphrase: this.network.networkPassphrase,
      })
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
        this.network?.networkPassphrase ?? "",
      )
      console.log("TXS", txs)
      const result = await this.horizon.submitTransaction(txs)
      console.log("RES", result)
      //console.log("hash:", result.hash);
      //console.log("status:", result.status);
      //console.log("errorResultXdr:", result.errorResultXdr)
      if (result?.successful) {
        return {
          success: true,
          result,
          txid,
          walletAddress: this.connectedWallet,
        }
      }
      return {
        success: false,
        error: "Payment rejected by user",
        result,
        txid,
      }
    } catch (err) {
      console.error("E>>", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }
    }
  }

  async fetchLedger(query: string) {
    try {
      //let url = this.soroban + query
      const url = this.horizon + query
      console.log("FETCH", url)
      const options = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
      const result = await fetch(url, options)
      const data = await result.json()
      return data
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return { error: error.message }
      }
      return { error: "Unknown error" }
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
      id: txInfo.id,
      hash: txInfo.hash,
      from: txInfo.source_account,
      to: txInfo.to,
      value: opInfo?.amount,
      fee: txInfo.fee,
      timestamp: txInfo.created_at,
      blockNumber: txInfo.ledger,
      destinationTag: tag,
    }
    return result
  }
}

export default FreighterWallet
