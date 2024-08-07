import { keys as _keys } from "lodash"
import {
  FreighterWallet,
  MetaMaskWallet,
  StellarServer,
  Web3Server,
  XrplServer,
  XummClient,
} from "../interfaces"
import type { ChainSlugs, Network } from "./chainConfig"

interface ManagerChainConfig {
  network: Network
  wallets: string[]
  coins: string[]
  contracts: Record<string, string>
}

type ManagerConfigChains = Partial<Record<ChainSlugs, ManagerChainConfig>>

interface ManagerConfig extends ManagerConfigChains {
  defaults: {
    network: Network
    wallet: string
    chain: string
    coin: string
  }
}

type ChainClasses<ClientClass, ServerClass> = {
  client: ClientClass
  server: ServerClass
}

export default class BlockchainManager {
  private static instance: BlockchainManager

  public config?: ManagerConfig

  public arbitrum?: ChainClasses<MetaMaskWallet, Web3Server>
  public avalanche?: ChainClasses<MetaMaskWallet, Web3Server>
  public base?: ChainClasses<MetaMaskWallet, Web3Server>
  public binance?: ChainClasses<MetaMaskWallet, Web3Server>
  public celo?: ChainClasses<MetaMaskWallet, Web3Server>
  public eos?: ChainClasses<MetaMaskWallet, Web3Server>
  public ethereum?: ChainClasses<MetaMaskWallet, Web3Server>
  public filecoin?: ChainClasses<MetaMaskWallet, Web3Server>
  public flare?: ChainClasses<MetaMaskWallet, Web3Server>
  public optimism?: ChainClasses<MetaMaskWallet, Web3Server>
  public polygon?: ChainClasses<MetaMaskWallet, Web3Server>
  public starknet?: ChainClasses<MetaMaskWallet, Web3Server>
  public stellar?: ChainClasses<FreighterWallet, StellarServer>
  public xinfin?: ChainClasses<MetaMaskWallet, Web3Server>
  public xrpl?: ChainClasses<XummClient, XrplServer>

  private constructor(config: ManagerConfig) {
    this.config = config || {}
    this.initialize()
  }

  connectChain<Client, Server>(
    chain: ChainSlugs,
    ClientInterface: any, //hard to infer the type
    ServerInterface: any, //hard to infer the type
  ): ChainClasses<Client, Server> | undefined {
    if (!this.config) {
      throw new Error("Config not provided")
    }
    const chainConfig = this.config[chain]
    if (!chainConfig) {
      return
    }
    return {
      server: new ServerInterface(
        chain,
        chainConfig.network || this.config.defaults.network,
      ),
      client: new ClientInterface(
        chain,
        chainConfig.network || this.config.defaults.network,
      ),
    }
  }

  initialize() {
    if (!this.config) {
      throw new Error("Config not provided")
    }
    this.arbitrum = this.connectChain<MetaMaskWallet, Web3Server>(
      "arbitrum",
      MetaMaskWallet,
      Web3Server,
    )
    this.avalanche = this.connectChain<MetaMaskWallet, Web3Server>(
      "avalanche",
      MetaMaskWallet,
      Web3Server,
    )
    this.base = this.connectChain<MetaMaskWallet, Web3Server>(
      "base",
      MetaMaskWallet,
      Web3Server,
    )
    this.binance = this.connectChain<MetaMaskWallet, Web3Server>(
      "binance",
      MetaMaskWallet,
      Web3Server,
    )
    this.celo = this.connectChain<MetaMaskWallet, Web3Server>(
      "celo",
      MetaMaskWallet,
      Web3Server,
    )
    this.eos = this.connectChain<MetaMaskWallet, Web3Server>(
      "eos",
      MetaMaskWallet,
      Web3Server,
    )
    this.ethereum = this.connectChain<MetaMaskWallet, Web3Server>(
      "ethereum",
      MetaMaskWallet,
      Web3Server,
    )
    this.filecoin = this.connectChain<MetaMaskWallet, Web3Server>(
      "filecoin",
      MetaMaskWallet,
      Web3Server,
    )
    this.flare = this.connectChain<MetaMaskWallet, Web3Server>(
      "flare",
      MetaMaskWallet,
      Web3Server,
    )
    this.optimism = this.connectChain<MetaMaskWallet, Web3Server>(
      "optimism",
      MetaMaskWallet,
      Web3Server,
    )
    this.polygon = this.connectChain<MetaMaskWallet, Web3Server>(
      "polygon",
      MetaMaskWallet,
      Web3Server,
    )
    // this.starknet = this.connectChain<, Web3Server?>("starknet", ArgentWallet, Web3Server?)
    this.stellar = this.connectChain<FreighterWallet, StellarServer>(
      "stellar",
      FreighterWallet,
      StellarServer,
    )
    this.xinfin = this.connectChain<MetaMaskWallet, Web3Server>(
      "xinfin",
      MetaMaskWallet,
      Web3Server,
    )
    this.xrpl = this.connectChain<XummClient, XrplServer>(
      "xrpl",
      XummClient,
      XrplServer,
    )
  }

  public static initialize(config: ManagerConfig): BlockchainManager {
    if (!BlockchainManager.instance) {
      BlockchainManager.instance = new BlockchainManager(config)
    }
    return BlockchainManager.instance
  }

  public static getInstance(): BlockchainManager {
    if (!BlockchainManager.instance) {
      throw new Error(
        "BlockchainManager is not initialized. Call initialize() first.",
      )
    }
    return BlockchainManager.instance
  }
}
