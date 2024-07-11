import ChainBaseClass, { Chain, ChainSymbol } from "../ChainBaseClass";

export type FilecoinNetworks = "mainnet" | "testnet" | "hyperspace";

export const mainnetConfig = {
  id: 43114,
  name: "Filecoin Mainnet",
  symbol: "FIL",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://filscan.io",
  rpcurl: "https://api.node.glif.io/rpc/v1",
  wssurl: "",
};

export const testnetConfig = {
  id: 314159,
  name: "Filecoin Testnet",
  symbol: "FIL",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://calibration.filscan.io",
  rpcurl: "https://api.calibration.node.glif.io/rpc/v1",
  wssurl: "",
};

export const hyperspace = {
  id: 43113,
  name: "Filecoin Hyperspace",
  symbol: "FIL",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://hyperspace.filscan.io",
  rpcurl: "https://api.hyperspace.node.glif.io/rpc/v1",
  wssurl: "",
};

export const filecoinNetworks = {
  mainnet: mainnetConfig,
  testnet: testnetConfig,
  hyperspace,
};

class Filecoin extends ChainBaseClass {
  chain: Chain = "Filecoin";
  symbol: ChainSymbol = "FIL";
  logo = "fil.svg";
  mainnet = mainnetConfig;
  testnet = testnetConfig;

  constructor(
    { network }: { network: FilecoinNetworks } = { network: "mainnet" },
  ) {
    super();
    this.network = network;
    this.provider = filecoinNetworks[network];
  }

  async getTransactionInfo(txid: string): Promise<unknown> {
    console.log("Get tx info", txid);
    const info = await this.fetchLedger("eth_getTransactionByHash", [txid]);
    if (!info || info?.error) {
      return {
        success: false,
        error: "Error fetching tx info",
      };
    }
    const result = {
      success: true,
      account: info?.from,
      destination: info?.to,
      destinationTag: this.hexToStr(info?.input),
      amount: this.fromBaseUnit(info?.value),
    };
    return result;
  }

  async fetchLedger(method: string, params: unknown) {
    let data = { id: "1", jsonrpc: "2.0", method, params };
    let body = JSON.stringify(data);
    let opt = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    };
    try {
      let res = await fetch(this.provider.rpcurl, opt);
      let inf = await res.json();
      return inf?.result;
    } catch (ex: any) {
      console.error(ex);
      return { error: ex.message };
    }
  }
}

export default Filecoin;
