// Startup file for instrumentation
import appConfig from "@cfce/app-config"
import { BlockchainManager } from "@cfce/blockchain-tools"
import selectAppConfigForEnvironment from "./appConfig/selectAppConfigForEnvironment"

export async function register() {
  // BlockchainManager.initialize({
  //   chains: appConfig.chains,
  //   defaults: appConfig.chainDefaults,
  // })

  // authProviders depends on 'crypto', which is only available on server runtime
  // Why does it run on other runtimes? I don't know: https://github.com/vercel/next.js/discussions/56968
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // E.g. google, github, freighter, etc.
    const setAuthProviders = (await import("@cfce/utils")).setAuthProviders
    setAuthProviders(appConfig.auth)
  }
}
