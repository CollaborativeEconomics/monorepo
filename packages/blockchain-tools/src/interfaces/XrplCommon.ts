import type { ChainConfig } from "@cfce/types"
import type { NetworkConfig } from "@cfce/types"
import { get } from "lodash"
import {
  Client,
  type NFTokenCreateOffer,
  type NFTokenMint,
  type Node,
  type Payment,
  type TransactionMetadata,
  type TxResponse,
  isCreatedNode,
  isModifiedNode,
} from "xrpl"
import { getNetworkForChain } from "../chains/utils"
import InterfaceBaseClass from "../chains/InterfaceBaseClass"
import chainConfiguration from "../chains/chainConfig"

type transactionMethods =
  | "tx"
  | "submit"
  | "submit_multisigned"
  | "transaction_entry"
  | "tx_history"

export default class XrplCommon extends InterfaceBaseClass {
  chain: ChainConfig
  network: NetworkConfig

  constructor() {
    super()
    this.chain = chainConfiguration.xrpl
    this.network = getNetworkForChain("xrpl")
  }
  async getTransactionInfo(txId: string) {
    const payload = { transaction: txId, binary: false }
    const txInfo = await this.fetchLedger("tx", payload)

    if (!txInfo || "error" in txInfo.result) {
      throw new Error(
        `Transaction not found: ${txInfo.result?.error ?? "no transaction"}`,
      )
    }
    if (txInfo?.result?.validated === undefined && txInfo?.result?.validated) {
      console.log("ERROR", "Transaction is not validated on ledger")
      return { error: "Transaction is not validated on ledger" }
    }

    const result = txInfo.result
    return {
      id: result.hash,
      hash: result.hash,
      from: result.Account,
      to: result.Destination,
      value: result.Amount,
      fee: result.Fee,
      timestamp: "", // XRPL transactions do not directly provide a timestamp
      blockNumber: result.ledger_index,
    }
  }

  findOffer(
    txInfo: TxResponse<NFTokenCreateOffer>,
  ): string | { error: string } {
    const affectedNodes = get(txInfo, "result.meta.AffectedNodes") as
      | Node[]
      | undefined
    if (typeof affectedNodes === "undefined") {
      return { error: "No affected nodes found" }
    }
    for (let i = 0; i < affectedNodes.length; i++) {
      const node = affectedNodes[i]
      if (
        isCreatedNode(node) &&
        node.CreatedNode.LedgerEntryType === "NFTokenOffer"
      ) {
        return node.CreatedNode.LedgerIndex
      }
    }
    return { error: "Offer not found" }
  }

  async fetchLedger(
    method: transactionMethods,
    params: Record<string, unknown>,
  ) {
    try {
      const url = this.network.rpcUrls.main
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          params: [params],
        }),
      }
      const result = await fetch(url, options)
      const data = await result.json()
      return data
    } catch (ex) {
      console.error(ex)
      if (ex instanceof Error) {
        return { error: ex.message }
      }
      return { error: "Unknown error" }
    }
  }

  findToken(txInfo: TxResponse<NFTokenMint>): string | { error: string } {
    //const meta = txInfo?.result?.meta as TransactionMetadata<NFTokenMintMetadata>
    //const tokenID = meta?.nftoken_id as string
    const tokenID = get(txInfo, "result.meta.nftoken_id") as string
    console.log("TOKEN ID", tokenID)
    if (tokenID) {
      return tokenID
    }
    return { error: "Token not found" }
  }

  /*
  findTokenOLD(txInfo: TxResponse<NFTokenMint>): string | { error: string } {
    // Extract affected nodes
    const affectedNodes = get(txInfo, "result.meta.AffectedNodes") as
      | Node[]
      | undefined
    if (!Array.isArray(affectedNodes)) {
      return { error: "No affected nodes found" }
    }

    // Check first time there is no modified nodes
    for (const node of affectedNodes) {
      if (isCreatedNode(node) && node.CreatedNode.LedgerEntryType === "NFTokenPage") {
        return node.CreatedNode.NewFields.NFTokens[0].NFToken.NFTokenID
      }
    }

    // Iterate through each node to find the modified node with new token
    for (const node of affectedNodes) {
      if (isModifiedNode(node)) {
        const tokens = get(node, "ModifiedNode.FinalFields.NFTokens") as NFTokenPage["NFTokens"] | undefined
        const previousTokens = get(node, "ModifiedNode.PreviousFields.NFTokens") as NFTokenPage["NFTokens"] | undefined
        // Check if tokens and previous tokens are defined
        if (!tokens || !previousTokens) {
          continue
          //return { error: "No final or previous fields found" }
        }
        const newTokenId = this.getNewTokenId(tokens, previousTokens)
        if (newTokenId) {
          return newTokenId
        }
      }
    }
    return { error: "Token not found" }
  }

  // Helper method to get the new token ID by comparing tokens and previousTokens
  private getNewTokenId(
    tokens: NFTokenPage["NFTokens"],
    previousTokens: NFTokenPage["NFTokens"],
  ): string | null {
    for (const token of tokens) {
      const tokenId = token.NFToken.NFTokenID

      // Check if the token ID is not present in the previous tokens
      const isNewToken = !previousTokens.some(
        (prevToken) => prevToken.NFToken.NFTokenID === tokenId,
      )
      if (isNewToken) {
        return tokenId
      }
    }

    return null
  }
*/

  async sendPayment({
    address,
    amount,
    memo,
  }: { address: string; amount: number; memo?: string }) {
    console.log("PAY", address, amount, memo)
    const sender = "0x0" // TODO: get from wallet
    //const wei = Math.floor(amount * 1000000).toString()
    const wei = String(this.toBaseUnit(amount))
    const transaction = {
      TransactionType: "Payment",
      Account: sender,
      Destination: address,
      Amount: wei,
    } as Payment
    const url = this.network.rpcUrls.main
    const client = new Client(url)
    await client.connect()
    //const payment = await client.autofill(transaction)
    //const res = await client.submit(payment)
    const res = await client.submitAndWait(transaction)
    console.log("RES", res)
    //const code = res?.result?.meta?.TransactionResult
    client.disconnect()
    return { success: true }

    //if (code === "tesSUCCESS") {
    //  console.log('Transaction succeeded')
    //  return {success:true}
    //}
    //console.log('Error sending transaction:', code)
    //return {success:false, error:'Error sending payment'}
  }
}
