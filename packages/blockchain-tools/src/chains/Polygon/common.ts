import ChainInstance, { Chain, ChainSymbol } from "../ChainInstance";

export const mainnetConfig = {
  id: 137,
  name: "Polygon Mainnet",
  symbol: "MATIC",
  decimals: 18,
  gasprice: "2050000000",
  explorer: "https://polygonscan.com",
  rpcurl: "https://polygon-rpc.com",
  wssurl: "",
};

export const testnetConfig = {
  id: 80001,
  name: "Polygon Testnet",
  symbol: "MATIC",
  decimals: 18,
  gasprice: "2050000000",
  explorer: "https://mumbai.polygonscan.com",
  rpcurl: "https://rpc-mumbai.maticvigil.com",
  wssurl: "",
};

class Polygon extends ChainInstance {
  chain: Chain = "Polygon";
  symbol: ChainSymbol = "MATIC";
  logo = "matic.svg";
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
}

export default Polygon;
