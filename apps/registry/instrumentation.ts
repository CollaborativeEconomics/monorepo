import { BlockchainManager } from "@cfce/blockchain-tools"
// Startup file for instrumentation
import { appConfig } from "@cfce/utils"
import { setAuthProviders } from "@cfce/utils"

// E.g. google, github, freighter, etc.
setAuthProviders(appConfig.auth)
