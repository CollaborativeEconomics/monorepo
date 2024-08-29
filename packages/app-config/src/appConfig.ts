// import { dirname } from "path"
// import { existsSync } from "node:fs"
// import { resolve } from "node:path"
import type {
  ChainSlugs,
  ClientInterfaces,
  Network,
  TokenTickerSymbol,
} from "@cfce/blockchain-tools"
// import { register } from "ts-node"
import appConfigExample from "./appConfigExample"

export type AuthTypes = ClientInterfaces | "github" | "google"

type Envs = "development" | "staging" | "production"

const configPaths: Record<Envs, string> = {
  development: "appConfig.dev.ts",
  staging: "appConfig.staging.ts",
  production: "appConfig.ts",
}

type ContractType = "receiptMintbotERC721"
interface ChainConfig {
  name: string
  slug: ChainSlugs
  network: string
  contracts: Partial<Record<ContractType, string>>
  wallets: ClientInterfaces[]
  tokens: TokenTickerSymbol[]
  destinationTag?: string
}

export interface Config {
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
  chains: ChainConfig[]
  chainDefaults: {
    network: Network
    wallet: ClientInterfaces
    chain: ChainSlugs
    coin: TokenTickerSymbol
  }
}

// Register ts-node to handle TypeScript files
// register({
//   transpileOnly: true,
//   compilerOptions: {
//     module: "commonjs",
//   },
// })

let appConfigs: Record<Envs, Config> | null = null

// Load the configuration for each environemnt
// ie appConfig.dev.ts, appConfig.staging.ts, appConfig.ts
function loadConfig(): Record<Envs, Config> {
  if (appConfigs) {
    return appConfigs
  }
  const rootDir = process.cwd()
  console.log({
    cwd: process.cwd(),
    dirname: __dirname,
    filename: __filename,
  })
  const configs = {} as Record<Envs, Config>
  for (const env of Object.keys(configPaths)) {
    // const configPath = resolve(rootDir, configPaths[env as Envs]) // app/appConfig.dev.ts
    // console.log("CONFIG", configPath, rootDir)
    // if (existsSync(configPath)) {
    //   const { config } = require(configPath) // `ts-node` will handle the TypeScript file
    //   configs[env as Envs] = config as Config
    // }
    // throw new Error(`Configuration file not found at ${configPath}`)
    configs[env as Envs] = appConfigExample
  }
  return configs as Record<Envs, Config>
}

appConfigs = loadConfig()

const environment: Envs = (process.env.APP_ENV || "staging") as Envs

const appConfig = appConfigs[environment]

export default appConfig as Config
