import type { ChainSlugs } from "@cfce/types"
import arbitrum from "./factories/arbitrum"
import starknet from "./factories/starknet"
import stellar from "./factories/stellar"

type ContractFactoryTypes = "Credits" | "NFTReceipt"

export type FactoryReturnType = {
  success: boolean
  txid: string | null
  contractId: string | null
  block: string | null
  error: string | null
}

export type ContractFactoryDeployer = Record<
  ContractFactoryTypes,
  { deploy: (data: unknown) => Promise<FactoryReturnType> }
>

const FactoryDeployers: Partial<Record<ChainSlugs, ContractFactoryDeployer>> = {
  arbitrum,
  stellar,
  starknet,
}

export function FactoryDeployersList() {
  return Object.keys(FactoryDeployers)
}

export default FactoryDeployers
