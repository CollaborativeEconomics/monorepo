import type {
  AppChainSettings,
  ChainSlugs,
  Chains,
  NetworkConfig,
} from "@cfce/types"
import chainConfig from "./chainConfig"

// Simple helper to combine configs, with override handling
export function getChainConfig(
  chain: ChainSlugs,
  chainSettings: AppChainSettings,
) {
  const baseConfig = chainConfig[chain]

  if (!baseConfig || !chainSettings) return undefined

  // 1. Get the selected network configuration
  const selectedNetwork = baseConfig.networks[
    chainSettings.network
  ] as NetworkConfig
  if (!selectedNetwork) return undefined

  // 2. Merge contracts
  const mergedContracts = {
    ...(selectedNetwork.contracts || {}),
    ...chainSettings.contracts,
  }

  // 3. Create the default network configuration
  const defaultNetwork = {
    ...selectedNetwork,
    contracts: mergedContracts,
    wallet: chainSettings.wallet ?? selectedNetwork.wallet,
  }

  // 4. Combine everything into the final config
  const mergedConfig: Chains[ChainSlugs] & {
    networks: {
      default: NetworkConfig
    }
  } = {
    ...baseConfig,
    networks: {
      ...baseConfig.networks,
      default: defaultNetwork,
    },
  }

  return mergedConfig
}
