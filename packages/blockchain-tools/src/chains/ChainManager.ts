import {
  FreighterWallet,
  MetaMaskWallet,
  StellarServer,
  Web3Server,
  XummClient,
  XrplServer,
} from "@/interfaces"
import type { ChainSlugs, Network } from "./chainConfig"

interface ManagerChainConfig {
  network: Network
  wallets: string[]
  coins: string[]
  contracts: Record<string, string>
}

type ManagerConfigChains = Record<ChainSlugs, ManagerChainConfig>

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

  public config: ManagerConfig

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
    this.config = config
    this.initialize()
  }

  initialize() {
    this.arbitrum = {
      client: new MetaMaskWallet(
        "arbitrum",
        this.config.arbitrum.network || this.config.defaults.network,
      ),
      server: new Web3Server(
        "arbitrum",
        this.config.arbitrum.network || this.config.defaults.network,
      ),
    }
    this.avalanche = {
      client: new MetaMaskWallet(
        "avalanche",
        this.config.avalanche.network || this.config.defaults.network,
      ),
      server: new Web3Server(
        "avalanche",
        this.config.avalanche.network || this.config.defaults.network,
      ),
    }
    this.base = {
      client: new MetaMaskWallet(
        "base",
        this.config.base.network || this.config.defaults.network,
      ),
      server: new Web3Server(
        "base",
        this.config.base.network || this.config.defaults.network,
      ),
    }
    this.binance = {
      client: new MetaMaskWallet(
        "binance",
        this.config.binance.network || this.config.defaults.network,
      ),
      server: new Web3Server(
        "binance",
        this.config.binance.network || this.config.defaults.network,
      ),
    }
    this.celo = {
      client: new MetaMaskWallet(
        "celo",
        this.config.celo.network || this.config.defaults.network,
      ),
      server: new Web3Server(
        "celo",
        this.config.celo.network || this.config.defaults.network,
      ),
    }
    this.eos = {
      client: new MetaMaskWallet(
        "eos",
        this.config.eos.network || this.config.defaults.network,
      ),
      server: new Web3Server(
        "eos",
        this.config.eos.network || this.config.defaults.network,
      ),
    }
    this.ethereum = {
      client: new MetaMaskWallet(
        "ethereum",
        this.config.ethereum.network || this.config.defaults.network,
      ),
      server: new Web3Server(
        "ethereum",
        this.config.ethereum.network || this.config.defaults.network,
      ),
    }
    this.filecoin = {
      client: new MetaMaskWallet(
        "filecoin",
        this.config.filecoin.network || this.config.defaults.network,
      ),
      server: new Web3Server(
        "filecoin",
        this.config.filecoin.network || this.config.defaults.network,
      ),
    }
    this.flare = {
      client: new MetaMaskWallet(
        "flare",
        this.config.flare.network || this.config.defaults.network,
      ),
      server: new Web3Server(
        "flare",
        this.config.flare.network || this.config.defaults.network,
      ),
    }
    this.optimism = {
      client: new MetaMaskWallet(
        "optimism",
        this.config.optimism.network || this.config.defaults.network,
      ),
      server: new Web3Server(
        "optimism",
        this.config.optimism.network || this.config.defaults.network,
      ),
    }
    this.polygon = {
      client: new MetaMaskWallet(
        "polygon",
        this.config.polygon.network || this.config.defaults.network,
      ),
      server: new Web3Server(
        "polygon",
        this.config.polygon.network || this.config.defaults.network,
      ),
    }
    // this.starknet = {
    // client: new ArgentClient('starknet', this.config.starknet.network || this.config.defaults.network),
    //   server: new Web3Server('starknet', this.config.starknet.network || this.config.defaults.network)
    // }
    this.stellar = {
      client: new FreighterWallet(
        "stellar",
        this.config.stellar.network || this.config.defaults.network,
      ),
      server: new StellarServer(
        "stellar",
        this.config.stellar.network || this.config.defaults.network,
      ),
    }
    this.xinfin = {
      client: new MetaMaskWallet(
        "xinfin",
        this.config.xinfin.network || this.config.defaults.network,
      ),
      server: new Web3Server(
        "xinfin",
        this.config.xinfin.network || this.config.defaults.network,
      ),
    }
    this.xrpl = {
      client: new XummClient(
        "xrpl",
        this.config.xrpl.network || this.config.defaults.network,
      ),
      server: new XrplServer(
        "xrpl",
        this.config.xrpl.network || this.config.defaults.network,
      ),
    }
  }

  public static initialize(config: any): BlockchainManager {
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
