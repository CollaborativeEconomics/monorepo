import { FreighterWallet, MetaMaskWallet } from "@/interfaces"
import { ChainConfig } from "./chainConfig"
import Web3Server from "@/interfaces/web3"

type ChainClasses<ClientClass, ServerClass> = {
  client: ClientClass
  server: ServerClass
}

export default class BlockchainManager {
  private static instance: BlockchainManager

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
  public xrpl?: ChainClasses<XrplClient, XrplServer>

  private constructor(config: Chains) {
    if (config.arbitrum) {
      this.stellar = {
        client: this.createInterface(config.arbitrum, "freighter"),
        server: this.createInterface(config.arbitrum, "freighter"),
      }
    }
  }

  createInterface(
    config: ChainConfig,
    interfaceName: "freighter" | "metamask" | "xumm" | "web3",
  ) {
    switch (interfaceName) {
      case "freighter":
        return new FreighterWallet(config)
      case "metamask":
        return new MetaMaskWallet(config)
      case "xumm":
        return new XummWallet(config)
      case "web3":
        return new Web3Wallet(config)
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
