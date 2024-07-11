import ChainBaseClass, { Chain, ChainSymbol } from "../ChainBaseClass";

export const mainnetConfig = {
  id: 56,
  name: "Binance Mainnet",
  symbol: "BNB",
  decimals: 18,
  gasprice: "9000000000",
  explorer: "https://bscscan.com",
  rpcurl: "https://bsc-dataseed.binance.org",
  wssurl: "",
};

export const testnetConfig = {
  id: 97,
  name: "Binance Testnet",
  symbol: "BNB",
  decimals: 18,
  gasprice: "9000000000",
  explorer: "https://testnet.bscscan.com",
  rpcurl: "https://data-seed-prebsc-1-s1.binance.org:8545",
  wssurl: "",
};

class Binance extends ChainBaseClass {
  chain: Chain = "Binance";
  symbol: ChainSymbol = "BNB";
  logo = "bnb.svg";
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

export default Binance;
