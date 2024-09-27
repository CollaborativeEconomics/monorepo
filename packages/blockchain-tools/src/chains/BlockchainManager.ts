import appConfig from "@cfce/app-config"
import type {
  ChainSlugs,
  ClientInterfaces,
  Network,
  TokenTickerSymbol,
} from "@cfce/types"
import { keys as _keys } from "lodash"
import { get as _get } from "lodash"
import type { Interface } from "../interfaces"
import FreighterWallet from "../interfaces/FreighterWallet"
import MetaMaskWallet from "../interfaces/MetamaskClient"
import TronLinkWallet from "../interfaces/TronLinkClient"
import TronServer from "../interfaces/TronServer"
import StellarServer from "../interfaces/StellarServer"
import Web3Server from "../interfaces/Web3Server"
import XrplServer from "../interfaces/XrplServer"
import XummClient from "../interfaces/XummClient"
import _SacrificialInterface from "../interfaces/_SacrificialInterface"
import type ChainBaseClass from "./ChainBaseClass"

type ChainClasses<ClientClass = Interface, ServerClass = Interface> = {
  client: ChainBaseClass
  server: ChainBaseClass
}

const getNetwork = (slug: ChainSlugs): Network =>
  appConfig.chains.find((c) => c.slug === slug)?.network ??
  appConfig.chainDefaults.network

const BlockchainManager = {
  arbitrum: {
    client: new MetaMaskWallet("arbitrum", getNetwork("arbitrum")),
    server: new Web3Server("arbitrum", getNetwork("arbitrum")),
  },
  avalanche: {
    client: new MetaMaskWallet("avalanche", getNetwork("avalanche")),
    server: new Web3Server("avalanche", getNetwork("avalanche")),
  },
  base: {
    client: new MetaMaskWallet("base", getNetwork("base")),
    server: new Web3Server("base", getNetwork("base")),
  },
  binance: {
    client: new MetaMaskWallet("binance", getNetwork("binance")),
    server: new Web3Server("binance", getNetwork("binance")),
  },
  celo: {
    client: new MetaMaskWallet("celo", getNetwork("celo")),
    server: new Web3Server("celo", getNetwork("celo")),
  },
  eos: {
    client: new MetaMaskWallet("eos", getNetwork("eos")),
    server: new Web3Server("eos", getNetwork("eos")),
  },
  ethereum: {
    client: new MetaMaskWallet("ethereum", getNetwork("ethereum")),
    server: new Web3Server("ethereum", getNetwork("ethereum")),
  },
  filecoin: {
    client: new MetaMaskWallet("filecoin", getNetwork("filecoin")),
    server: new Web3Server("filecoin", getNetwork("filecoin")),
  },
  flare: {
    client: new MetaMaskWallet("flare", getNetwork("flare")),
    server: new Web3Server("flare", getNetwork("flare")),
  },
  optimism: {
    client: new MetaMaskWallet("optimism", getNetwork("optimism")),
    server: new Web3Server("optimism", getNetwork("optimism")),
  },
  polygon: {
    client: new MetaMaskWallet("polygon", getNetwork("polygon")),
    server: new Web3Server("polygon", getNetwork("polygon")),
  },
  starknet: {
    client: new MetaMaskWallet("starknet", getNetwork("starknet")),
    server: new Web3Server("starknet", getNetwork("starknet")),
  },
  stellar: {
    client: new FreighterWallet("stellar", getNetwork("stellar")),
    server: new StellarServer("stellar", getNetwork("stellar")),
  },
  tron: {
    client: new TronLinkWallet("tron", getNetwork("tron")),
    server: new TronServer("tron", getNetwork("tron")),
  },
  xinfin: {
    client: new MetaMaskWallet("xinfin", getNetwork("xinfin")),
    server: new Web3Server("xinfin", getNetwork("xinfin")),
  },
  xrpl: {
    client: new XummClient("xrpl", getNetwork("xrpl")),
    server: new XrplServer("xrpl", getNetwork("xrpl")),
  },
} satisfies Record<ChainSlugs, ChainClasses>

export default BlockchainManager
