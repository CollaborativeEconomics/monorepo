import { BlockchainManager } from "@cfce/blockchain-tools"

export default async function getTransactionInfo(txid: string) {
  console.log("txid:", txid)
  if (!BlockchainManager.stellar) {
    return { error: "Stellar server not initialized" }
  }
  const txInfo = await BlockchainManager.stellar.server.fetchLedger(
    `/transactions/${txid}/operations`,
  )
  if (!txInfo || "error" in txInfo) {
    console.log("ERROR", "Transaction not found:", txid)
    return { error: "Transaction not found" }
  }
  console.log("OPS", txInfo?._embedded?.records)
  return txInfo?._embedded?.records
}
