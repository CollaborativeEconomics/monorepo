import { chainConfig } from "@cfce/app-config"
import type { ChainConfig, NetworkConfig } from "@cfce/types"
import {
  getNetwork,
  getNetworkDetails,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api"
import * as StellarSDK from "@stellar/stellar-sdk"
import { rpc } from "@stellar/stellar-sdk"
import {
  Address,
  BASE_FEE,
  Contract,
  TransactionBuilder,
  type xdr,
} from "@stellar/stellar-sdk"
import InterfaceBaseClass from "../chains/InterfaceBaseClass"
import { getNetworkForChain } from "../chains/utils"

class FreighterWallet extends InterfaceBaseClass {
  network: NetworkConfig
  chain: ChainConfig
  soroban: rpc.Server
  horizon: StellarSDK.Horizon.Server
  horizonConfig = {
    network: "",
    netinfo: {},
  }
  connectedWallet = ""

  constructor() {
    super()
    this.network = getNetworkForChain("stellar")
    this.chain = chainConfig.stellar
    this.horizon = new StellarSDK.Horizon.Server(this.network.rpcUrls.default)
    this.soroban = new rpc.Server(this.network.rpcUrls.soroban, {
      allowHttp: true,
    })
    //console.log("FREIGHT INIT")
    //console.log("RPC", this.network)
  }

  async init() {
    if (await isConnected()) {
      return { success: true }
    }
    return { success: false }
  }

  isConnected() {
    return this.connectedWallet !== ""
  }

  async connect() {
    try {
      console.log("CONNECT...")
      this.connectedWallet = await (await requestAccess()).address
      console.log("CONNECTED WALLET", this.connectedWallet)
      this.horizonConfig.network = (
        (await getNetwork()).network || ""
      ).toLowerCase()
      this.horizonConfig.netinfo = await getNetworkDetails()
      console.log("FNET", this.network)
      return {
        success: true,
        walletAddress: this.connectedWallet,
        network: this.network,
        chain: this.chain.name,
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
    console.log("SENDING PAYMENT", address, amount, memo)
    console.log("CONNECTED WALLET", this.connectedWallet)
    try {
      console.log("From", this.connectedWallet || "???")
      console.log("Paying", amount, "XLM to", address, "Memo", memo || "[no]")
      if (!this.connectedWallet) {
        await this.connect()
      }
      const memoTag = memo
        ? Number.isNaN(Number.parseInt(memo))
          ? undefined
          : Number.parseInt(memo)
        : undefined
      const act = await this.horizon.loadAccount(this.connectedWallet)
      //const fee = 5000
      const fee = await this.horizon.fetchBaseFee() // 100
      // freighter limits to 7 decimal places
      const xlm = amount.toFixed(7)
      console.log(xlm, typeof xlm)
      const data = {
        destination: address,
        //amount: `${amount}`,
        amount: xlm, // Stellar sends XLM as whole, not stroops
        asset: StellarSDK.Asset.native(),
      }
      const opr = StellarSDK.Operation.payment(data)
      const opt = {
        fee: `${fee}`,
        network: this.network.rpcUrls.default,
        networkPassphrase: this.network.networkPassphrase,
      }
      console.log("OPR:", data)
      console.log("OPT:", opt)
      const txn = new StellarSDK.TransactionBuilder(act, opt)
        //.setNetworkPassphrase(this.network.networkPassphrase)
        .addOperation(opr)
        .setTimeout(30)
      if (memoTag) {
        txn.addMemo(StellarSDK.Memo.text(memo)) // here we pass string not number
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

  async invokeContract(
    contractId: string,
    method: string,
    args: xdr.ScVal[],
  ): Promise<string> {
    try {
      if (!this.connectedWallet) {
        await this.connect()
      }

      const contract = new Contract(contractId)
      const operation = contract.call(method, ...args)

      const account = await this.soroban.getAccount(this.connectedWallet)
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.network.networkPassphrase || "",
      })
        .addOperation(operation)
        .setTimeout(30)
        .build()

      const simulated = await this.soroban.simulateTransaction(transaction)

      if (rpc.Api.isSimulationError(simulated)) {
        throw new Error(simulated.error ?? "Transaction simulation failed")
      }

      const preparedTransaction =
        await this.soroban.prepareTransaction(transaction)

      const signed = await signTransaction(preparedTransaction.toXDR(), {
        networkPassphrase: this.network.networkPassphrase || "",
      })

      if (!signed.signedTxXdr) {
        throw new Error("Failed to sign transaction")
      }

      const txs = TransactionBuilder.fromXDR(
        signed.signedTxXdr,
        this.network.networkPassphrase || "",
      )
      const submittedTx = await this.soroban.sendTransaction(txs)

      if (submittedTx.status.toString() === "ERROR") {
        throw new Error("Transaction failed")
      }

      // Wait for confirmation
      const maxRetries = 15
      const waitTimes = [
        2000, 2000, 2000, 3000, 3000, 3000, 4000, 4000, 4000, 5000, 5000, 5000,
        6000, 6000, 6000,
      ]

      for (let i = 0; i < maxRetries; i++) {
        await new Promise((resolve) => setTimeout(resolve, waitTimes[i]))
        const txInfo = await this.soroban.getTransaction(submittedTx.hash || "")

        if (txInfo.status === "FAILED") {
          throw new Error("Transaction failed")
        }

        if (txInfo.status === "NOT_FOUND") {
          continue
        }
        if (txInfo.status === "SUCCESS" && txInfo.resultMetaXdr) {
          return txInfo.resultMetaXdr.toXDR().toString()
        }
      }

      throw new Error("Transaction timed out")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      throw new Error(`Contract invocation failed: ${message}`)
    }
  }

  // Helper method for donations specifically
  async sendToContract({
    contractId,
    amount,
    isFirstTime = false,
  }: {
    contractId: string
    amount: number
    isFirstTime?: boolean
  }) {
    try {
      console.log(
        "SENDING TO CONTRACT",
        contractId,
        amount,
        this.connectedWallet,
      )
      if (!this.connectedWallet) {
        throw new Error("Wallet not connected")
      }

      // Create Address object first, then convert to ScVal
      const address = new Address(this.connectedWallet)
      const addressScVal = address.toScVal()

      const amountScVal = StellarSDK.nativeToScVal(this.toBaseUnit(amount), {
        type: "i128",
      })

      const txId = await this.invokeContract(contractId, "donate", [
        addressScVal,
        amountScVal,
      ])
      return {
        success: true,
        txId,
        walletAddress: this.connectedWallet,
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}
export default FreighterWallet
