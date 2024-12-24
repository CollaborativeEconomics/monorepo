// import { Transaction } from "../types/transaction"
import type {
  ChainConfig,
  ChainSlugs,
  Network,
  NetworkConfig,
} from "@cfce/types"
import { BASE_FEE, SorobanRpc } from "@stellar/stellar-sdk"
import type {
  Transaction as StellarTransaction,
  // Address,
  // Contract,
  // Keypair,
  // TransactionBuilder,
} from "@stellar/stellar-sdk"
// import Stellar, { StellarNetworks } from "./common"
import InterfaceBaseClass from "../chains/InterfaceBaseClass"
import chainConfig from "../chains/chainConfig"
import { getNetworkForChain } from "../chains/utils"
import Contract721 from "../contracts/soroban/nft721/server"

export default class StellarServer extends InterfaceBaseClass {
  sorobanServer: SorobanRpc.Server
  network: NetworkConfig
  chain: ChainConfig

  constructor() {
    super()
    this.chain = chainConfig.stellar
    this.network = getNetworkForChain(this.chain.slug)
    this.sorobanServer = new SorobanRpc.Server(this.network.rpcUrls.main)
  }

  async mintNFT({
    uri,
    address,
    contractId,
    walletSeed,
  }: {
    contractId: string
    uri: string
    address: string
    taxon?: number
    transfer?: boolean
    walletSeed: string
  }) {
    console.log(
      this.chain.name,
      "minting NFT to",
      address,
      uri,
      "in",
      this.network.slug,
    )
    console.log("CTR", contractId, this.network.rpcUrls.main)
    const contract = new Contract721({
      contractId,
      rpcUrl: this.network.rpcUrls.main,
      secret: walletSeed,
    })
    //console.log('CTR', contract.spec)
    // const info = await contract.mint({ to: address })
    const response = await contract.submit({
      network: this.network,
      secret: walletSeed,
      contractId,
      method: "mint",
      args: [address],
    })
    console.log("MINT result", response)
    return response
  }

  async submitTx(tx: StellarTransaction) {
    try {
      const response = await this.sorobanServer.sendTransaction(tx)
      console.log(`Sent transaction: ${JSON.stringify(response)}`)
      const txid = response.hash

      if (response.status === "PENDING") {
        let result = await this.sorobanServer.getTransaction(response.hash)
        // Poll `getTransaction` until the status is not "NOT_FOUND"
        while (result.status === "NOT_FOUND") {
          console.log("Waiting for transaction confirmation...")
          // See if the transaction is complete
          result = await this.sorobanServer.getTransaction(response.hash)
          // Wait two seconds
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
        //console.log(`getTransaction response: ${JSON.stringify(result)}`);
        console.log("Status:", result.status)
        if (result.status === "SUCCESS") {
          console.log("RESULT:", result)
          // Make sure the transaction's resultMetaXDR is not empty
          if (!result.resultMetaXdr) {
            throw "Empty resultMetaXDR in getTransaction response"
          }
          // Find the return value from the contract and return it
          const transactionMeta = result.resultMetaXdr
          //const metares  = result.resultMetaXdr.v3().sorobanMeta().returnValue();
          //console.log('METARES:', metares);
          const returnValue = result.returnValue //parseResultXdr(result.returnValue);
          //const metaXDR = SorobanClient.xdr.TransactionMeta.fromXDR(result.resultMetaXdr, "base64")
          //console.log('METAXDR:', JSON.stringify(metaXDR,null,2));
          //console.log('Return meta:', JSON.stringify(transactionMeta,null,2));
          console.log("Return value:", JSON.stringify(returnValue, null, 2))
          //console.log(`Return value: ${returnValue}`);
          return {
            success: true,
            value: returnValue,
            meta: transactionMeta,
            txid,
          }
        }
        console.log("XDR:", JSON.stringify(result.resultXdr, null, 2))
        throw `Transaction failed: ${result.resultXdr}`
      }
    } catch (err) {
      // Catch and report any errors we've thrown
      console.log("Sending transaction failed")
      console.log(JSON.stringify(err))
      throw err
    }
  }

  async createSellOffer({
    tokenId,
    destinationAddress,
    offerExpirationDate,
  }: {
    tokenId: string
    destinationAddress: string
    offerExpirationDate?: string
  }) {
    console.log("Creating sell offer", tokenId, destinationAddress)
    // TODO: Implementation for creating a sell offer
    return { success: false, error: "createSellOffer method not implemented." }
  }

  async fetchLedger(query: string) {
    try {
      const url = `${this.network.rpcUrls.main}/${query}`
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

  async getTransactionInfo(txId: string) {
    // Fetch the transaction info
    const txInfo = await this.fetchLedger(`transactions/${txId}`)
    if (!txInfo || txInfo.status === 404) {
      return { error: "Transaction not found" }
    }
    if (!txInfo.successful) {
      return { error: "Transaction not valid" }
    }

    // Compute the operation ID
    const page = BigInt(txInfo.paging_token) + BigInt(1)
    const opid = page.toString()

    // Fetch the operation info
    const opInfo = await this.fetchLedger(`operations/${opid}`)
    if (!opInfo || opInfo.status === 404) {
      return { error: "Operation not found" }
    }
    if (!opInfo.transaction_successful) {
      return { error: "Operation not valid" }
    }

    return {
      id: txInfo.id,
      hash: txInfo.hash,
      from: txInfo.source_account,
      to: opInfo.to || "", // Assuming the operation has a 'to' field
      value: opInfo.amount || "0", // Assuming the operation has an 'amount' field
      fee: txInfo.fee_charged,
      timestamp: txInfo.created_at,
      blockNumber: txInfo.ledger,
    }
  }
}
