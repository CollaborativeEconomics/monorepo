import { ChainBaseClass } from "@/chains"
import { get } from "lodash"
import {
  type NFTokenCreateOffer,
  type NFTokenMint,
  type Node,
  type TxResponse,
  isCreatedNode,
  isModifiedNode,
} from "xrpl"
import type { NFTokenPage } from "xrpl/dist/npm/models/ledger"
import { Transaction } from "../types/transaction"

type transactionMethods =
  | "tx"
  | "submit"
  | "submit_multisigned"
  | "transaction_entry"
  | "tx_history"

export default class XrplCommon extends ChainBaseClass {
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
      const url = this.network.rpcUrl
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
    // Extract affected nodes
    const affectedNodes = get(txInfo, "result.meta.AffectedNodes") as
      | Node[]
      | undefined
    if (!Array.isArray(affectedNodes)) {
      return { error: "No affected nodes found" }
    }

    // Iterate through each node to find the modified node with new token
    for (const node of affectedNodes) {
      if (isModifiedNode(node)) {
        const tokens = get(node, "ModifiedNode.FinalFields.NFTokens") as
          | NFTokenPage["NFTokens"]
          | undefined
        const previousTokens = get(
          node,
          "ModifiedNode.PreviousFields.NFTokens",
        ) as NFTokenPage["NFTokens"] | undefined

        // Check if tokens and previous tokens are defined
        if (!tokens || !previousTokens) {
          return { error: "No final or previous fields found" }
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
}
