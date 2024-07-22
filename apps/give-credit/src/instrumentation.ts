// Startup file for instrumentation
import appConfig from "./appConfig"
import appConfigStaging from "./appConfig.staging"
import { BlockchainManager } from "@cfce/blockchain-tools"

if (process.env.NODE_ENV === "production") {
  BlockchainManager.initialize(appConfig.chains)
} else {
  BlockchainManager.initialize(appConfigStaging.chains)
}
