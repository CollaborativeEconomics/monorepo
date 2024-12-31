import { BlockchainServerInterfaces } from "@cfce/blockchain-tools"

export default async function getTransactionInfo(txid: string) {
  console.log("txid:", txid)
  const serverInterface = BlockchainServerInterfaces.evm
  serverInterface.setChain("tron")
  const txInfo = await serverInterface.fetchLedger(`/transactions/${txid}`, {})
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
