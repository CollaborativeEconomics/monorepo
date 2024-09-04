import { keys as _keys } from "lodash"
import {
  type ClientInterfaces,
  FreighterWallet,
  type Interface,
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

type ChainClasses<ClientClass = Interface, ServerClass = Interface> = {
  client: ClientClass
  server: ServerClass
}

type ChainConstructor = new (slug: ChainSlugs, network: string) => Interface

export class BlockchainManager {
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

  connectChain(
    chain: ChainSlugs,
    ClientInterface: ChainConstructor,
    ServerInterface: ChainConstructor,
  ): ChainClasses | undefined {
    if (!this.config) {
      throw new Error("Config not provided")
    }
    if (!ClientInterface || !ServerInterface) {
      // throw new Error("Client or Server interface not provided")
      console.warn("Client or Server interface not provided")
      // @ts-ignore
      return { client: undefined, server: undefined }
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
      console.log(
        typeof ClientInterface,
        typeof ServerInterface,
        ClientInterface,
        ServerInterface,
      )
      throw new Error(
        `Error connecting chain: ${chain}, ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  public initialize(config?: ManagerConfig) {
    if (config) {
      this.config = config
    }
    if (!this.config) {
      throw new Error("Config not provided")
    }
    // @ts-ignore
    this.arbitrum = this.connectChain("arbitrum", MetaMaskWallet, Web3Server)
    // @ts-ignore
    this.avalanche = this.connectChain("avalanche", MetaMaskWallet, Web3Server)
    // @ts-ignore
    this.base = this.connectChain("base", MetaMaskWallet, Web3Server)
    // @ts-ignore
    this.binance = this.connectChain("binance", MetaMaskWallet, Web3Server)
    // @ts-ignore
    this.celo = this.connectChain("celo", MetaMaskWallet, Web3Server)
    // @ts-ignore
    this.eos = this.connectChain("eos", MetaMaskWallet, Web3Server)
    // @ts-ignore
    this.ethereum = this.connectChain("ethereum", MetaMaskWallet, Web3Server)
    // @ts-ignore
    this.filecoin = this.connectChain("filecoin", MetaMaskWallet, Web3Server)
    // @ts-ignore
    this.flare = this.connectChain("flare", MetaMaskWallet, Web3Server)
    // @ts-ignore
    this.optimism = this.connectChain("optimism", MetaMaskWallet, Web3Server)
    // @ts-ignore
    this.polygon = this.connectChain("polygon", MetaMaskWallet, Web3Server)
    // this.starknet = this.connectChain<, Web3Server?>("starknet", ArgentWallet, Web3Server?)
    // @ts-ignore
    this.stellar = this.connectChain("stellar", FreighterWallet, StellarServer)
    // @ts-ignore
    this.xinfin = this.connectChain("xinfin", MetaMaskWallet, Web3Server)
    // @ts-ignore
    this.xrpl = this.connectChain("xrpl", XummClient, XrplServer)
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

export default new BlockchainManager()
