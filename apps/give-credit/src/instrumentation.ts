// Startup file for instrumentation
import appConfig, { setAppConfig } from "@cfce/app-config"
import { BlockchainManager } from "@cfce/blockchain-tools"
import { setAuthProviders } from "@cfce/utils"

import appConfigDev from "../appConfig.development"
import appConfigProd from "../appConfig.production"
import appConfigStaging from "../appConfig.staging"

console.log("db env", process.env.POSTGRES_PRISMA_URL)

setAppConfig(
  process.env.APP_ENV === "production"
    ? appConfigProd
    : process.env.APP_ENV === "staging"
      ? appConfigStaging
      : appConfigDev,
)

BlockchainManager.initialize({
  chains: appConfig.chains,
  defaults: appConfig.chainDefaults,
})

// E.g. google, github, freighter, etc.
setAuthProviders(appConfig.auth)
