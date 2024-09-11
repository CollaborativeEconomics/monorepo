import type { ChainSlugs, Network } from "@cfce/types"
import { ChainBaseClass } from "../chains"

// NOTE: For some reason when importing the interfaces into BlockchainManager, the first interface (alphabetically) is imported as undefined
//  So we create this class to sacrifice as the first-born interface to the code dragons
export default class _SacrificialInterface extends ChainBaseClass {
  constructor(slug: ChainSlugs, network: Network) {
    super(slug, network)
    console.log("constructed!")
  }
  async connect() {
    console.log("Dummy connect")
    return { success: true, walletAddress: "0x1234567890", network: "testnet" }
  }
  async sendPayment() {
    console.log("Dummy sendPayment")
    return { success: true }
  }
  async fetchLedger() {
    console.log("Dummy fetchLedger")
    return { success: true }
  }
  async getTransactionInfo() {
    return { error: "asdf" }
  }
}
