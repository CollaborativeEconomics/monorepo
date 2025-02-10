import type { ChainSlugs, RuntimeChainConfig } from "@cfce/types"
import chainConfig from "./chainConfig"

import appConfig from "./appConfig"

// Simple helper to combine configs, with override handling
export function getChainConfig(
  chain: ChainSlugs,
): RuntimeChainConfig | undefined {
  const baseConfig = chainConfig[chain]
  const appSettings = appConfig.chains[chain]

  if (!baseConfig || !appSettings) return undefined

  // Deep merge the network config with any overrides
  const mergedConfig = {
    ...baseConfig,
    networks: {
      ...baseConfig.networks,
      default: {
        ...baseConfig.networks[appSettings.network],
        contracts: {
          ...baseConfig.networks[appSettings.network].contracts,
          ...appSettings.contracts,
        },
        wallet:
          appSettings.wallet ?? baseConfig.networks[appSettings.network].wallet,
      },
    },
    appSettings,
  }

  return mergedConfig
}
