import { ArbitrumClient, ArbitrumServer } from "./Arbitrum";
import { AvalancheClient, AvalancheServer } from "./Avalanche";
import { BaseClient, BaseServer } from "./Base";
import { BinanceClient, BinanceServer } from "./Binance";
import { CeloClient, CeloServer } from "./Celo";
import { Chain } from "./ChainBaseClass";
import { EosClient, EosServer } from "./Eos";
import { EthereumClient, EthereumServer } from "./Ethereum";
import { FilecoinClient, FilecoinServer } from "./Filecoin";
import { FlareClient, FlareServer } from "./Flare";
import { OptimismClient, OptimismServer } from "./Optimism";
import { PolygonClient, PolygonServer } from "./Polygon";
import { StarknetClient, StarknetServer } from "./Starknet";
import { StellarClient, StellarServer } from "./Stellar";
import { XinFinClient, XinFinServer } from "./XinFin";
import { XrplClient, XrplServer } from "./Xrpl";

type ChainClasses<ClientClass, ServerClass> = {
  client: ClientClass,
  server: ServerClass
}

class BlockchainManager {
  private static instance: BlockchainManager;

  public arbitrum?: ChainClasses<ArbitrumClient, ArbitrumServer>;
  public avalanche?: ChainClasses<AvalancheClient, AvalancheServer>;
  public base?: ChainClasses<BaseClient, BaseServer>;
  public binance?: ChainClasses<BinanceClient, BinanceServer>;
  public celo?: ChainClasses<CeloClient, CeloServer>;
  public eos?: ChainClasses<EosClient, EosServer>;
  public ethereum?: ChainClasses<EthereumClient, EthereumServer>;
  public filecoin?: ChainClasses<FilecoinClient, FilecoinServer>;
  public flare?: ChainClasses<FlareClient, FlareServer>;
  public optimism?: ChainClasses<OptimismClient, OptimismServer>;
  public polygon?: ChainClasses<PolygonClient, PolygonServer>;
  public starknet?: ChainClasses<StarknetClient, StarknetServer>;
  public stellar?: ChainClasses<StellarClient, StellarServer>;
  public xinfin?: ChainClasses<XinFinClient, XinFinServer>;
  public xrpl?: ChainClasses<XrplClient, XrplServer>;

  private constructor(config: any) {
    if (config.chains.arbitrum) {
      this.stellar = {
        client: new ArbitrumClient(config.chains.arbitrum),
        server: new ArbitrumServer(config.chains.arbitrum),
      }
    }
  }

  public static initialize(config: any): BlockchainManager {
    if (!BlockchainManager.instance) {
      BlockchainManager.instance = new BlockchainManager(config);
    }
    return BlockchainManager.instance;
  }

  public static getInstance(): BlockchainManager {
    if (!BlockchainManager.instance) {
      throw new Error("BlockchainManager is not initialized. Call initialize() first.");
    }
    return BlockchainManager.instance;
  }
}