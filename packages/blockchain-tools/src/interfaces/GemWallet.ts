import type { ChainSlugs } from "@cfce/types"
import gemWallet from "@gemwallet/api"
import XrplCommon from "./XrplCommon"

export default class GemWallet extends XrplCommon {
  connectedWallet = ""

  async connect() {
    try {
      const ready = await gemWallet.isInstalled()
      const installed = ready?.result?.isInstalled
      console.log("GEM Ready?", installed)
      if (!installed) {
        return { success: false, error: "GemWallet not installed" }
      }
      const res = await gemWallet.getAddress() // <<<< Here gets stuck forever
      console.log("RES", res)
      this.connectedWallet = res.result?.address || ""
      console.log("GemWallet", this.connectedWallet)
      return {
        success: true,
        walletAddress: this.connectedWallet,
        network: this.network.slug,
        chain: "xrpl" as ChainSlugs,
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
      const sender = this.connectedWallet
      const wei = Math.floor(amount * 1000000).toString()
      //const wei = String(this.toBaseUnit(amount))

      const payload = {
        amount: wei,
        destination: address,
        //memos: [],
        //destinationTag: 12,
        //fee: "199",
        //flags: {
        //  tfNoDirectRipple: false,
        //  tfPartialPayment: false,
        //  tfLimitQuality: false,
        //},
      }
      console.log("TX", payload)
      const res = await gemWallet.sendPayment(payload)
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
