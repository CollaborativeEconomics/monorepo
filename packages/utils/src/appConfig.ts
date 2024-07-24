import type {
  ChainSlugs,
  Interfaces,
  Network,
  TokenTickerSymbol,
} from "@cfce/blockchain-tools"
import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { register } from "ts-node"

type Envs = "development" | "staging" | "production"

const configPaths: Record<Envs, string> = {
  development: "appConfig.dev.ts",
  staging: "appConfig.staging.ts",
  production: "appConfig.ts",
}

interface Config {
  siteInfo: {
    title: string
    description: string
  }
  apis: {
    registry: {
      apiUrl: string
    }
    ipfs: {
      endpoint: string
      region: string
      gateway: string
      pinning: string
      buckets: {
        nfts: string
        avatars: string
        media: string
      }
    }
  }
  auth: string[]
  chains: Partial<
    Record<
      ChainSlugs,
      {
        network: Network
        contracts: Partial<
          Record<"CCreceiptMintbotERC721" | "receiptMintbotERC721", string>
        >
        wallets: Interfaces[]
        coins: TokenTickerSymbol[]
      }
    >
  >
  chainDefaults: {
    network: Network
    wallet: Interfaces
    chain: ChainSlugs
    coin: TokenTickerSymbol
  }
}

// Register ts-node to handle TypeScript files
register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
  },
})

let appConfigs: Record<Envs, Config> | null = null

// Load the configuration for each environemnt
// ie appConfig.dev.ts, appConfig.staging.ts, appConfig.ts
function loadConfig(): Record<Envs, Config> {
  if (appConfig) {
    return appConfig
  }
  const rootDir = process.cwd()
  const configs = {}
  for (const env of Object.keys(configPaths)) {
    const configPath = resolve(rootDir, configPaths[env]) // app/appConfig.dev.ts
    if (existsSync(configPath)) {
      const { config } = require(configPath) // `ts-node` will handle the TypeScript file
      configs[env] = config as Config
    }
    throw new Error(`Configuration file not found at ${configPath}`)
  }
  return configs as Record<Envs, Config>
}

appConfigs = loadConfig()

const appConfig = appConfigs[process.env.APP_ENV || "staging"]

export default appConfig as Config
