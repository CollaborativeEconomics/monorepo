import type { Chain } from "@cfce/database"
import Arbitrum from "./factories/arbitrum"
import Starknet from "./factories/starknet"
import Stellar from "./factories/stellar"

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
  (data: unknown) => Promise<FactoryReturnType>
>

const FactoryDeployers: Partial<Record<Chain, ContractFactoryDeployer>> = {
  Arbitrum,
  Stellar,
  Starknet,
}

export function FactoryDeployersList() {
  return Object.keys(FactoryDeployers)
}

export default FactoryDeployers
