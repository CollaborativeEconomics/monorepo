import { existsSync } from "node:fs"
import { resolve } from "node:path"
import type {
  ChainSlugs,
  ClientInterfaces,
  Interfaces,
  Network,
  TokenTickerSymbol,
} from "@cfce/blockchain-tools"
import type { Chain } from "@cfce/database"
import { register } from "ts-node"
import type { AuthTypes } from "./auth/authProviders"

type Envs = "development" | "staging" | "production"

const configPaths: Record<Envs, string> = {
  development: "appConfig.dev.ts",
  staging: "appConfig.staging.ts",
  production: "appConfig.ts",
}

export interface AppConfig {
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
  auth: AuthTypes[]
  chains: Array<{
    name: Chain
    slug: ChainSlugs
    network: Network
    contracts: Partial<
      Record<"CCreceiptMintbotERC721" | "receiptMintbotERC721", string>
    >
    wallets: ClientInterfaces[]
    coins: TokenTickerSymbol[]
    destinationTag?: string
  }>
  chainDefaults: {
    network: Network
    wallet: ClientInterfaces
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

let appConfigs: Record<Envs, AppConfig> | null = null

// Load the configuration for each environemnt
// ie appConfig.dev.ts, appConfig.staging.ts, appConfig.ts
function loadConfig(): Record<Envs, AppConfig> {
  if (appConfigs) {
    return appConfigs
  }
  const rootDir = process.cwd()
  const configs = {} as Record<Envs, AppConfig>
  for (const env of Object.keys(configPaths)) {
    const configPath = resolve(rootDir, configPaths[env as Envs]) // app/appConfig.dev.ts
    if (existsSync(configPath)) {
      const { config } = require(configPath) // `ts-node` will handle the TypeScript file
      configs[env as Envs] = config as AppConfig
    }
    throw new Error(`Configuration file not found at ${configPath}`)
  }
  return configs as Record<Envs, AppConfig>
}

appConfigs = loadConfig()

const environment: Envs = (process.env.APP_ENV || "staging") as Envs

const appConfig = appConfigs[environment]

export default appConfig
