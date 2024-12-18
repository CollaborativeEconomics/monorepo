import appConfig from "@cfce/app-config"
import type { ChainSlugs, ClientInterfaces, Network } from "@cfce/types"
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
import _SacrificialInterface from "../interfaces/_SacrificialInterface"
import type ChainBaseClass from "./ChainBaseClass"

type ChainClasses<ClientClass = Interface, ServerClass = Interface> = {
  client: Partial<Record<ClientInterfaces, ChainBaseClass>>
  server: ChainBaseClass
}

const getNetwork = (slug: ChainSlugs): Network =>
  appConfig.chains[slug]?.network ?? appConfig.chainDefaults.network

const createEvmClients = (slug: ChainSlugs) => {
  const network = getNetwork(slug)
  return {
    metamask: new MetaMaskWallet(slug, network),
  }
}

export const BlockchainClientInterfaces: Record<
  ClientInterfaces,
  ChainBaseClass
> = {
  xaman: new XummClient("xrpl", getNetwork("xrpl")),
  crossmark: new CrossmarkWallet("xrpl", getNetwork("xrpl")),
  gemwallet: new GemWallet("xrpl", getNetwork("xrpl")),
  freighter: new FreighterWallet("stellar", getNetwork("stellar")),
  argent: new StarknetWallet("starknet", getNetwork("starknet")),
  metamask: new MetaMaskWallet("ethereum", getNetwork("ethereum")),
}

const BlockchainManager = {
  arbitrum: {
    client: createEvmClients("arbitrum"),
    server: new Web3Server("arbitrum", getNetwork("arbitrum")),
  },
  avalanche: {
    client: createEvmClients("avalanche"),
    server: new Web3Server("avalanche", getNetwork("avalanche")),
  },
  base: {
    client: createEvmClients("base"),
    server: new Web3Server("base", getNetwork("base")),
  },
  binance: {
    client: createEvmClients("binance"),
    server: new Web3Server("binance", getNetwork("binance")),
  },
  celo: {
    client: createEvmClients("celo"),
    server: new Web3Server("celo", getNetwork("celo")),
  },
  eos: {
    client: createEvmClients("eos"),
    server: new Web3Server("eos", getNetwork("eos")),
  },
  ethereum: {
    client: createEvmClients("ethereum"),
    server: new Web3Server("ethereum", getNetwork("ethereum")),
  },
  filecoin: {
    client: createEvmClients("filecoin"),
    server: new Web3Server("filecoin", getNetwork("filecoin")),
  },
  flare: {
    client: createEvmClients("flare"),
    server: new Web3Server("flare", getNetwork("flare")),
  },
  optimism: {
    client: createEvmClients("optimism"),
    server: new Web3Server("optimism", getNetwork("optimism")),
  },
  polygon: {
    client: createEvmClients("polygon"),
    server: new Web3Server("polygon", getNetwork("polygon")),
  },
  starknet: {
    client: {
      argent: new StarknetWallet("starknet", getNetwork("starknet")),
    },
    server: new StarknetWallet("starknet", getNetwork("starknet")),
  },
  stellar: {
    client: {
      freighter: new FreighterWallet("stellar", getNetwork("stellar")),
    },
    server: new StellarServer("stellar", getNetwork("stellar")),
  },
  tron: {
    // TODO: Add Tron wallet and server support
    client: createEvmClients("tron"),
    server: new Web3Server("tron", getNetwork("tron")),
  },
  xdc: {
    client: createEvmClients("xdc"),
    server: new Web3Server("xdc", getNetwork("xdc")),
  },
  xrpl: {
    client: {
      xaman: new XummClient("xrpl", getNetwork("xrpl")),
      crossmark: new CrossmarkWallet("xrpl", getNetwork("xrpl")),
      gemwallet: new GemWallet("xrpl", getNetwork("xrpl")),
    },
    server: new XrplServer("xrpl", getNetwork("xrpl"), 77777777), // NFT TAG SHOULD BE MOVED TO MINT_NFT METHOD
  },
} satisfies Record<ChainSlugs, ChainClasses>

export default BlockchainManager
