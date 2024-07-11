import ChainBaseClass, { Chain, ChainSymbol } from "../ChainBaseClass";

export const mainnetConfig = {
  id: 42161,
  name: "Starknet Mainnet",
  symbol: "STRK",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://sepolia.starkscan.co/",
  rpcurl: "https://starknet-sepolia.g.alchemy.com/v2/Z7y0BXn_ywvs8E87Gy8KpGHvkeDcvG79",
  wssurl: "",
};

export const testnetConfig = {
  id: 421614,
  name: "Starknet Testnet",
  symbol: "STRK",
  // decimals: 18,
  // gasprice: "250000000",
  // explorer: "https://sepolia.arbiscan.io",
  // rpcurl: "https://sepolia-rollup.Starknet.io/rpc",
  wssurl: "",
};

class Starknet extends ChainBaseClass {
  chain: Chain = "Starknet";
  symbol: ChainSymbol = "STRK";
  logo = "strk.svg";
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

export default Starknet;
