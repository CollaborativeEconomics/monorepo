import ChainBaseClass, { Chain, ChainSymbol } from "../ChainBaseClass";

export const mainnetConfig = {
  id: 1,
  name: "Ethereum Mainnet",
  symbol: "ETH",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://etherscan.io",
  rpcurl: "https://ethereum.publicnode.com",
  wssurl: "",
};

export const testnetConfig = {
  id: 5,
  name: "Ethereum Testnet",
  symbol: "ETH",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://goerli.etherscan.io",
  rpcurl: "https://ethereum-goerli.publicnode.com",
  wssurl: "",
};

class Ethereum extends ChainBaseClass {
  chain: Chain = "Ethereum";
  symbol: ChainSymbol = "ETH";
  logo = "eth.svg";
  mainnet = mainnetConfig;
  testnet = testnetConfig;

  constructor({ network } = { network: "mainnet" }) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
  }

  async getTransactionInfo(txid: string): Promise<unknown> {
    try {
      console.log('Get tx info by txid', txid)
      const info = await this.wallet.getTransactionInfo(txid)
      return info
    } catch (ex) {
      console.error(ex)
      if (ex instanceof Error) {
        return { error: ex.message }
      }
    }
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

export default Ethereum;
