import { BlockchainManager } from "@cfce/blockchain-tools"

export default async function getTransactionInfo(txid: string) {
  console.log("txid:", txid)
  if (!BlockchainManager.stellar) {
    return { error: "Stellar server not initialized" }
  }
  const txInfo = await BlockchainManager.stellar.server.fetchLedger(
    `/transactions/${txid}`,
  )
  if (!txInfo || "error" in txInfo) {
    console.log("ERROR", "Transaction not found:", txid)
    return { error: "Transaction not found" }
  }
  if (!txInfo?.successful) {
    console.log("ERROR", "Transaction not valid")
    return { error: "Transaction not valid" }
  }
  console.log("TXINFO", txInfo)
  return txInfo
}
