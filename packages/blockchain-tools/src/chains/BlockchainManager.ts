import appConfig from "@cfce/app-config"
import type {
  ChainSlugs,
  ClientInterfaces,
  Network,
  NetworkConfig,
} from "@cfce/types"
import { getNetwork } from "@stellar/freighter-api"
import { keys as _keys } from "lodash"
import { get as _get } from "lodash"
import type { Interface } from "../interfaces"
import CrossmarkWallet from "../interfaces/CrossmarkWallet"
import FreighterWallet from "../interfaces/FreighterWallet"
import GemWallet from "../interfaces/GemWallet"
import MetaMaskWallet from "../interfaces/MetamaskClient"
import StarknetWallet from "../interfaces/StarknetWallet"
import StellarServer from "../interfaces/StellarServer"
import Web3Server from "../interfaces/Web3Server"
import XrplServer from "../interfaces/XrplServer"
import XummClient from "../interfaces/XummClient"
import type InterfaceBaseClass from "./InterfaceBaseClass"
import chainConfiguration from "./chainConfig"

type ChainClasses<ClientClass = Interface, ServerClass = Interface> = {
  client: Partial<Record<ClientInterfaces, InterfaceBaseClass>>
  server: InterfaceBaseClass
}

/**
 * Get the network config for the chain, using appConfig.chainDefaults.network
 * @param slug - The chain slug
 * @returns The network config object
 */
const getNetworkForChain = (slug: ChainSlugs): NetworkConfig =>
  chainConfiguration[slug].networks[appConfig.chainDefaults.network]

const BlockchainClientInterfaces: Record<ClientInterfaces, InterfaceBaseClass> =
  {
    xaman: new XummClient(),
    crossmark: new CrossmarkWallet(),
    gemwallet: new GemWallet(),
    freighter: new FreighterWallet(),
    argent: new StarknetWallet(),
    metamask: new MetaMaskWallet(),
  }

const BlockchainServerInterfaces = {
  evm: new Web3Server(),
  // starknet: todo
  stellar: new StellarServer(),
  xrpl: new XrplServer(),
} satisfies Record<string, InterfaceBaseClass>

export {
  getNetworkForChain,
  BlockchainClientInterfaces,
  BlockchainServerInterfaces,
}
