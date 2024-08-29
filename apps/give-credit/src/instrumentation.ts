// Startup file for instrumentation
import appConfig from "@cfce/app-config"
import { BlockchainManager } from "@cfce/blockchain-tools"
import { setAuthProviders } from "@cfce/utils"

// E.g. google, github, freighter, etc.
setAuthProviders(appConfig.auth)
