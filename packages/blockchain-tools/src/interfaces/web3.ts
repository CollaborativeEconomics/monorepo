import ChainBaseClass from "@/chains/ChainBaseClass"

export default class Web3Server extends ChainBaseClass {
  async getTransactionInfo(txid: string): Promise<unknown> {
    try {
      console.log("Get tx info by txid", txid)
      const info = await this.wallet.getTransactionInfo(txid)
      return info
    } catch (ex) {
      console.error(ex)
      if (ex instanceof Error) {
        return { error: ex.message }
      }
    }
  }

  async fetchLedger(method: string, params: unknown) {
    const data = { id: "1", jsonrpc: "2.0", method, params }
    const body = JSON.stringify(data)
    const opt = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }
    try {
      const res = await fetch(this.network.rpcurl, opt)
      const inf = await res.json()
      return inf?.result
    } catch (ex: any) {
      console.error(ex)
      return { error: ex.message }
    }
  }
}
