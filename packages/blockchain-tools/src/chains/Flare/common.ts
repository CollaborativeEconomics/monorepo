import ChainInstance, { Chain, ChainSymbol } from "../ChainInstance";

export const mainnetConfig = {
  id: 14,
  name: "Flare Mainnet",
  symbol: "FLR",
  decimals: 18,
  gasprice: "25000000000",
  explorer: "https://flare-explorer.flare.net",
  rpcurl: "https://songbird.towolabs.com/rpc",
  wssurl: "",
};

export const testnetConfig = {
  id: 16,
  name: "Flare Testnet",
  symbol: "FLR",
  decimals: 18,
  gasprice: "25000000000",
  explorer: "https://coston-explorer.flare.network",
  rpcurl: "https://coston-api.flare.network/ext/bc/C/rpc",
  wssurl: "",
};

class Flare extends ChainInstance {
  chain: Chain = "Flare";
  symbol: ChainSymbol = "FLR";
  logo = "flr.svg";
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
      console.log("Error", info);
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
}

export default Flare;
