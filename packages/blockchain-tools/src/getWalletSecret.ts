import { chainConfig } from "@cfce/app-config"
import type { ChainSlugs } from "@cfce/types"

export const getWalletSecret = (chain: ChainSlugs) => {
  const config = chainConfig[chain]
  if (!config) {
    throw new Error(`Chain config not found for ${chain}`)
  }
  return process.env[`${chain.toUpperCase()}_WALLET_SECRET`] ?? ""
}
