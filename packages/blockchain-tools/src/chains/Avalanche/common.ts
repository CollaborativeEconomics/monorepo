import ChainInstance, { Chain, ChainSymbol } from "../ChainInstance";

export const mainnetConfig = {
  id: 43114,
  name: "Avalanche Mainnet",
  symbol: "AVAX",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://snowtrace.io",
  rpcurl: "https://api.avax.network/ext/bc/C/rpc",
  wssurl: "",
};

export const testnetConfig = {
  id: 43113,
  name: "Avalanche Testnet",
  symbol: "AVAX",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://testnet.snowtrace.io",
  rpcurl: "https://api.avax-test.network/ext/bc/C/rpc",
  wssurl: "",
};

class Avalanche extends ChainInstance {
  chain: Chain = "Avalanche";
  symbol: ChainSymbol = "AVAX";
  logo = "avax.svg";
  mainnet = mainnetConfig;
  testnet = testnetConfig;

  constructor({ network } = { network: "mainnet" }) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
  }

  async getTransactionInfo(txid: string): Promise<unknown> {
    console.log("Get tx info", txid);
    const info = await this.fetchLedger("eth_getTransactionByHash", [txid]);
    if (!info || info?.error) {
      return { success: false, error: "Error fetching tx info" };
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

  // TODO: Additional common methods specific to this blockchain
}

export default Avalanche;
