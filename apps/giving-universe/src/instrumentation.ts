import appConfig from "@cfce/app-config"
import { BlockchainManager } from "@cfce/blockchain-tools"

export function register() {
  console.log("register")
  if (appConfig.chains.some((c) => c.slug === "xrpl")) {
    BlockchainManager.xrpl.client.initialize(
      process.env.NEXT_PUBLIC_XUMM_API_KEY ?? "",
    )
  }
}
