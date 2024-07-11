import ChainBaseClass, { Chain, ChainSymbol } from "../ChainBaseClass";

export const mainnetConfig = {
  id: 42220,
  name: "Celo Mainnet",
  symbol: "CELO",
  decimals: 18,
  gasprice: "10000000000",
  explorer: "https://explorer.celo.org",
  rpcurl: "https://forno.celo.org",
  wssurl: "",
};

export const testnetConfig = {
  id: 44787,
  name: "Celo Testnet",
  symbol: "CELO",
  decimals: 18,
  gasprice: "10000000000",
  explorer: "https://alfajores-blockscout.celo-testnet.org",
  rpcurl: "https://alfajores-forno.celo-testnet.org",
  wssurl: "",
};

class Celo extends ChainBaseClass {
  chain: Chain = "Celo";
  symbol: ChainSymbol = "CELO";
  logo = "celo.svg";
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

export default Celo;
