import type {
  Chain,
  ChainConfig,
  Contract,
  ContractType,
  Network,
  NetworkConfig,
} from "@cfce/types"

import type { NFTData } from "@cfce/database"
import type { ChainSlugs } from "@cfce/types"

import { chainConfig } from "@cfce/app-config"

/**
 * Get the network config for the chain, using the app environment
 * @param slug - The chain slug
 * @returns The network config object
 */
export const getNetworkForChain = (slug: ChainSlugs): NetworkConfig =>
  chainConfig[slug].networks[
    process.env.NEXT_PUBLIC_APP_ENV === "production" ? "mainnet" : "testnet"
  ]

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
  const idToChainMapping = Object.values(chainConfig).reduce(
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

export const getChainConfigBySlug = (slug: ChainSlugs): ChainConfig => {
  const config = chainConfig[slug]
  if (!config) {
    throw new Error(`Chain configuration not found for ${slug}`)
  }
  return config
}

/**
 * Get the chain configuration by the chain name
 * @param name - The chain name
 * @returns The chain configuration
 */
export const getChainConfigurationByName = (name: Chain): ChainConfig => {
  const configs = Object.values(chainConfig)
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
  network: Network,
  rpcType = "main",
): string => {
  const config = chainConfig[chain]
  if (!config) {
    throw new Error(`Chain configuration not found for ${chain}`)
  }

  const networkConfig = config.networks[network] as NetworkConfig
  if (!networkConfig) {
    throw new Error(`Network configuration not found for ${chain} ${network}`)
  }

  const rpcUrl = networkConfig.rpcUrls[rpcType]
  if (!rpcUrl) {
    throw new Error(`RPC URL not found for ${chain} ${network} ${rpcType}`)
  }

  return rpcUrl
}

export const getNftPath = (nftData: {
  chain: ChainSlugs
  network: Network
  contractId?: string | null
  contractType?: Contract
  tokenId: string | number
  transactionId?: string | null
}): string => {
  const { chain, network } = nftData

  if (!chain || !network) {
    throw new Error("Chain label and network are required")
  }

  const tokenIdNumber = nftData.tokenId

  // Get chain and network configuration
  const networkConfig = getNetworkForChain(chain)
  if (!networkConfig) {
    throw new Error(`Network configuration not found for ${chain} ${network}`)
  }

  // Determine contractId with clear precedence:
  // 1. Use provided contractId if it exists
  // 2. Otherwise, try to get contract from network config if contractType is provided
  // 3. Fall back to empty string if neither exists
  const providedContractId = nftData.contractId || ""
  const contractFromType = nftData.contractType
    ? networkConfig.contracts?.[nftData.contractType] || ""
    : ""
  const contractId = providedContractId || contractFromType

  const explorer = networkConfig.explorer

  const path = explorer.nftPath
    .replace("{{contractId}}", contractId)
    .replace("{{tokenId}}", tokenIdNumber.toString())
    .replace("{{transactionId}}", nftData.transactionId || "")
  return `${explorer.url}${path}`
}
