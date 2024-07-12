import { FreighterWallet, MetaMaskWallet } from "@/interfaces"

type ChainClasses<ClientClass, ServerClass> = {
  client: ClientClass
  server: ServerClass
}

class BlockchainManager {
  private static instance: BlockchainManager

  public arbitrum?: ChainClasses<MetaMaskWallet, ArbitrumServer>
  public avalanche?: ChainClasses<MetaMaskWallet, AvalancheServer>
  public base?: ChainClasses<MetaMaskWallet, BaseServer>
  public binance?: ChainClasses<MetaMaskWallet, BinanceServer>
  public celo?: ChainClasses<MetaMaskWallet, CeloServer>
  public eos?: ChainClasses<MetaMaskWallet, EosServer>
  public ethereum?: ChainClasses<MetaMaskWallet, EthereumServer>
  public filecoin?: ChainClasses<MetaMaskWallet, FilecoinServer>
  public flare?: ChainClasses<MetaMaskWallet, FlareServer>
  public optimism?: ChainClasses<MetaMaskWallet, OptimismServer>
  public polygon?: ChainClasses<MetaMaskWallet, PolygonServer>
  public starknet?: ChainClasses<MetaMaskWallet, StarknetServer>
  public stellar?: ChainClasses<FreighterWallet, StellarServer>
  public xinfin?: ChainClasses<MetaMaskWallet, XinFinServer>
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
