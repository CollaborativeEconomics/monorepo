import { Chain, ChainConfig, NetworkConfig } from "@cfce/types"

import appConfig from "@cfce/app-config"
import { ChainSlugs } from "@cfce/types"
import chainConfiguration from "./chainConfig"

/**
 * Get the network config for the chain, using appConfig.chainDefaults.network
 * @param slug - The chain slug
 * @returns The network config object
 */
export const getNetworkForChain = (slug: ChainSlugs): NetworkConfig =>
  chainConfiguration[slug].networks[appConfig.chainDefaults.network]

/**
 * Get the chain config for the chain, using the chain ID (only ones defined by CFCE)
 * @param chainId - The chain ID
 * @returns The chain config object
 */
export const getChainByChainId = (chainId: number): ChainConfig => {
  // skip chains that don't use IDs like stellar and xrpl
  if (chainId === 0) {
    throw new Error("Chain ID 0 is not a valid chain ID")
  }
  const idToChainMapping = Object.values(chainConfiguration).reduce(
    (acc, chain) => {
      // Check IDs for each network
      for (const network of Object.values(chain.networks)) {
        if (network.id === chainId) {
          acc[chainId] = chain
        }
      }
      return acc
    },
    {} as Record<number, ChainConfig>,
  )
  if (!idToChainMapping[chainId]) {
    throw new Error(`Chain configuration not found for chain ID ${chainId}`)
  }
  return idToChainMapping[chainId]
}

/**
 * Get the chain configuration for chains defined in appConfig
 * @returns
 */
export const getChainConfiguration = (): Record<ChainSlugs, ChainConfig> => {
  const chainKeys = Object.keys(
    appConfig.chains,
  ) as (keyof typeof appConfig.chains)[]

  return chainKeys.reduce(
    (obj, key) => {
      obj[key] = chainConfiguration[key]
      return obj
    },
    {} as Record<ChainSlugs, ChainConfig>,
  )
}

/**
 * Get the chain configuration by the chain name
 * @param name - The chain name
 * @returns The chain configuration
 */
export const getChainConfigurationByName = (name: Chain): ChainConfig => {
  const configs = Object.values(chainConfiguration)
  const config = configs.find((config) => config.name === name)
  if (!config) {
    throw new Error(`Chain configuration not found for ${name}`)
  }
  return config
}

/**
 * Get the RPC URL for the chain, network, and RPC type
 * @param chain - The chain slug
 * @param network - The network name
 * @param rpcType - The RPC type (main, test, etc.)
 * @returns The RPC URL
 */
export const getRpcUrl = (
  chain: ChainSlugs,
  network: string,
  rpcType = "main",
): string => {
  const chainConfig = chainConfiguration[chain]
  if (!chainConfig) {
    throw new Error(`Chain configuration not found for ${chain}`)
  }

  const networkConfig = chainConfig.networks[network]
  if (!networkConfig) {
    throw new Error(`Network configuration not found for ${chain} ${network}`)
  }

  const rpcUrl = networkConfig.rpcUrls[rpcType]
  if (!rpcUrl) {
    throw new Error(`RPC URL not found for ${chain} ${network} ${rpcType}`)
  }

  return rpcUrl
}
