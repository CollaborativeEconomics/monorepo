import { BlockchainServerInterfaces } from "@cfce/blockchain-tools"

export default async function getTransactionInfo(txid: string) {
  console.log("txid:", txid)
  const serverInterface = BlockchainServerInterfaces.evm
  serverInterface.setChain("tron")
  const txInfo = await serverInterface.fetchLedger(
    `/transactions/${txid}/operations`,
    {},
  )
  if (!txInfo || "error" in txInfo) {
    console.log("ERROR", "Transaction not found:", txid)
    return { error: "Transaction not found" }
  }
  console.log("OPS", txInfo?._embedded?.records)
  return txInfo?._embedded?.records
}
