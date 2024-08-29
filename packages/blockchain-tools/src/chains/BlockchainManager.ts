import appConfig from "@cfce/app-config"
import { keys as _keys } from "lodash"
import {
  type ClientInterfaces,
  FreighterWallet,
  Interface,
  MetaMaskWallet,
  StellarServer,
  Web3Server,
  XrplServer,
  XummClient,
} from "../interfaces"
import type { ChainSlugs, Network, TokenTickerSymbol } from "./chainConfig"

type ContractType = "receiptMintbotERC721"
interface ChainConfig {
  name: string
  slug: ChainSlugs
  network: string
  contracts: Partial<Record<ContractType, string>>
  wallets: ClientInterfaces[]
  tokens: TokenTickerSymbol[]
  destinationTag?: string
}

interface ManagerConfig {
  chains: ChainConfig[]
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
  private static instance: BlockchainManager = new BlockchainManager({
    chains: appConfig.chains,
    defaults: appConfig.chainDefaults,
  })

  public config?: ManagerConfig

  private arbitrum?: ChainClasses<MetaMaskWallet, Web3Server>
  private avalanche?: ChainClasses<MetaMaskWallet, Web3Server>
  private base?: ChainClasses<MetaMaskWallet, Web3Server>
  private binance?: ChainClasses<MetaMaskWallet, Web3Server>
  private celo?: ChainClasses<MetaMaskWallet, Web3Server>
  private eos?: ChainClasses<MetaMaskWallet, Web3Server>
  private ethereum?: ChainClasses<MetaMaskWallet, Web3Server>
  private filecoin?: ChainClasses<MetaMaskWallet, Web3Server>
  private flare?: ChainClasses<MetaMaskWallet, Web3Server>
  private optimism?: ChainClasses<MetaMaskWallet, Web3Server>
  private polygon?: ChainClasses<MetaMaskWallet, Web3Server>
  private starknet?: ChainClasses<MetaMaskWallet, Web3Server>
  private stellar?: ChainClasses<FreighterWallet, StellarServer>
  private xinfin?: ChainClasses<MetaMaskWallet, Web3Server>
  private xrpl?: ChainClasses<XummClient, XrplServer>

  private constructor(config: ManagerConfig) {
    this.config = config || {}
    this.initialize()
  }

  connectChain<Client extends Interface, Server extends Interface>(
    chain: ChainSlugs,
    ClientInterface: Interface,
    ServerInterface: Interface,
  ): ChainClasses<Client, Server> | undefined {
    if (!this.config) {
      throw new Error("Config not provided")
    }
    try {
      const chainConfig = this.config.chains.find((c) => c.slug === chain)
      if (!chainConfig) {
        return
      }
      const clients = {
        server: new ServerInterface(
          chain,
          chainConfig.network || this.config.defaults.network,
        ),
        client: new ClientInterface(
          chain,
          chainConfig.network || this.config.defaults.network,
        ),
      }
      return clients
    } catch (error) {
      throw new Error(
        `Error connecting chain: ${chain}, ${error instanceof Error ? error.message : "Unknown error"}`,
      )
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

  public static get arbitrum() {
    return BlockchainManager.instance.arbitrum
  }
  public static get avalanche() {
    return BlockchainManager.instance.avalanche
  }
  public static get base() {
    return BlockchainManager.instance.base
  }
  public static get binance() {
    return BlockchainManager.instance.binance
  }
  public static get celo() {
    return BlockchainManager.instance.celo
  }
  public static get eos() {
    return BlockchainManager.instance.eos
  }
  public static get ethereum() {
    return BlockchainManager.instance.ethereum
  }
  public static get filecoin() {
    return BlockchainManager.instance.filecoin
  }
  public static get flare() {
    return BlockchainManager.instance.flare
  }
  public static get optimism() {
    return BlockchainManager.instance.optimism
  }
  public static get polygon() {
    return BlockchainManager.instance.polygon
  }
  public static get starknet() {
    return BlockchainManager.instance.starknet
  }
  public static get stellar() {
    return BlockchainManager.instance.stellar
  }
  public static get xinfin() {
    return BlockchainManager.instance.xinfin
  }
  public static get xrpl() {
    return BlockchainManager.instance.xrpl
  }
}
