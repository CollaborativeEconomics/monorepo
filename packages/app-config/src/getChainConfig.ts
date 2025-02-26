import type { ChainSlugs } from "@cfce/types"
import chainConfig from "./chainConfig"

// Simple helper to combine configs, with override handling
export function getChainConfig(chain: ChainSlugs) {
  const config = chainConfig[chain]
  const network =
    process.env.NEXT_PUBLIC_APP_ENV === "production" ? "mainnet" : "testnet"

  return config.networks[network]
}
