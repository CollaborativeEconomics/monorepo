import { isInstalled, getAddress, sendPayment } from "@gemwallet/api"
import XrplCommon from "./XrplCommon"

export default class GemWallet extends XrplCommon {
  connectedWallet = ""

  async connect() {
    try {
      const ready = await isInstalled()
      const installed = ready?.result?.isInstalled
      console.log("GEM Ready?", installed)
      if (!installed) {
        return { success: false, error: "GemWallet not installed" }
      }
      const res = await getAddress() // <<<< Here gets stuck forever
      console.log("RES", res)
      this.connectedWallet = res.result?.address || ""
      console.log("GemWallet", this.connectedWallet)
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
  }: { address: string; amount: number; memo?: string }) {
    console.log("PAY", address, amount, memo)
    try {
      const connected = await this.connect()
      console.log("CONNECTED", connected)
      const sender = this.connectedWallet
      const wei = Math.floor(amount * 1000000).toString()
      //const wei = String(this.toBaseUnit(amount))
      console.log("SENDER", sender)

      const payload = {
        amount: wei,
        destination: address,
        destinationTag: memo ? Number.parseInt(memo) : undefined,
        //memos: [],
        //fee: "199",
        //flags: {
        //  tfNoDirectRipple: false,
        //  tfPartialPayment: false,
        //  tfLimitQuality: false,
        //},
      }
      console.log("TX", payload)
      const res = await sendPayment(payload)
      console.log("RES", res)
      const txid = res?.result?.hash
      console.log("TXID", txid)
      //if (code === "tesSUCCESS") {
      //  console.log('Transaction succeeded')
      //  return {success:true}
      //}
      return {
        success: true,
        walletAddress: this.connectedWallet,
        txid,
        error: "",
      }
    } catch (ex) {
      console.log("Error sending payment")
      console.error(ex)
      return { success: false, error: "Error sending payment" }
    }
  }
}
