import { SorobanRpc, BASE_FEE } from "@stellar/stellar-sdk"
import type {
  Transaction,
  // Address,
  // Contract,
  // Keypair,
  // TransactionBuilder,
} from "@stellar/stellar-sdk"
// import Stellar, { StellarNetworks } from "./common"
import { ChainBaseClass } from "@/chains"
import type { ChainSlugs, Network } from "@/chains/chainConfig"
import Contract721 from "@/contracts/soroban/nft721/server"

export default class StellarServer extends ChainBaseClass {
  sorobanServer: SorobanRpc.Server

  constructor(slug: ChainSlugs, network: Network) {
    super(slug, network)
    this.sorobanServer = new SorobanRpc.Server(this.network.rpcUrl)
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
    console.log(this.chain, "minting NFT to", address, uri)
    const contract = new Contract721({
      contractId,
      rpcUrl: this.network.rpcUrl,
      secret: walletSeed,
    })
    //console.log('CTR', contract.spec)
    // const info = await contract.mint({ to: address })
    const response = contract.submit({
      network: this.network,
      secret: walletSeed,
      contractId,
      method: "mint",
      args: [address],
    })
    console.log("MINT result", response)
    return response
  }

  async submitTx(tx: Transaction) {
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
          // Wait one second
          await new Promise((resolve) => setTimeout(resolve, 1000))
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
      //let url = this.soroban + query
      const url = this.chain.networks.horizon.rpcUrl + query
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
      success: true,
      account: txInfo.source_account,
      amount: opInfo?.amount,
      destination: opInfo?.to,
      destinationTag: tag,
    }
    return result
  }
}
