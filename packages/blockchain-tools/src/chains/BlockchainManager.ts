import appConfig from "@cfce/app-config"
import type { AppConfig } from "@cfce/app-config"
import { keys as _keys } from "lodash"
import type { ClientInterfaces, Interface } from "../interfaces"
import {
  FreighterWallet,
  MetaMaskWallet,
  StellarServer,
  Web3Server,
  XrplServer,
  XummClient,
} from "../interfaces"
import type { ChainSlugs, Network, TokenTickerSymbol } from "./chainConfig"

console.log("BlockchainManager", {
  FreighterWallet,
  MetaMaskWallet,
  StellarServer,
  Web3Server,
  XrplServer,
  XummClient,
})

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
  private static instance: BlockchainManager = new BlockchainManager(appConfig)

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

  constructor(appConfig: AppConfig) {
    if (BlockchainManager.instance) {
      throw new Error("BlockchainManager is a singleton")
    }
    this.config = {
      chains: appConfig.chains,
      defaults: appConfig.chainDefaults,
    }
    console.log("BlockchainManager", this.config, appConfig)
    this.initialize(this.config)
  }

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
      console.warn(
        "Client or Server interface not provided",
        chain,
        ClientInterface,
        ServerInterface,
      )
      // @ts-ignore
      return { client: undefined, server: undefined }
    }
    try {
      console.log("chains", this.config.chains)
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
    if (!this.config) {
      throw new Error("Config not provided")
    }
    const chainInterfaceMap: Record<
      ChainSlugs,
      { client: ChainConstructor; server: ChainConstructor }
    > = {
      arbitrum: { client: MetaMaskWallet, server: Web3Server },
      avalanche: { client: MetaMaskWallet, server: Web3Server },
      base: { client: MetaMaskWallet, server: Web3Server },
      binance: { client: MetaMaskWallet, server: Web3Server },
      celo: { client: MetaMaskWallet, server: Web3Server },
      eos: { client: MetaMaskWallet, server: Web3Server },
      ethereum: { client: MetaMaskWallet, server: Web3Server },
      filecoin: { client: MetaMaskWallet, server: Web3Server },
      flare: { client: MetaMaskWallet, server: Web3Server },
      optimism: { client: MetaMaskWallet, server: Web3Server },
      polygon: { client: MetaMaskWallet, server: Web3Server },
      starknet: { client: MetaMaskWallet, server: Web3Server },
      stellar: { client: FreighterWallet, server: StellarServer },
      xinfin: { client: MetaMaskWallet, server: Web3Server },
      xrpl: { client: XummClient, server: XrplServer },
    }
    console.log({ chainInterfaceMap })
    for (const chain of this.config.chains) {
      console.log({
        MetaMaskWallet,
        Web3Server,
        FreighterWallet,
        StellarServer,
      })
      // @ts-ignore
      this[chain.slug] = this.connectChain(
        chain.slug,
        chainInterfaceMap[chain.slug].client,
        chainInterfaceMap[chain.slug].server,
      )
    }
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

export default BlockchainManager
