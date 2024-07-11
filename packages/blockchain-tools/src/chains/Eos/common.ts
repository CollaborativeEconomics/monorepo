import ChainBaseClass, { Chain, ChainSymbol } from "../ChainBaseClass";

export const mainnetConfig = {
  id: 17777,
  name: "EOS Mainnet",
  symbol: "EOS",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://explorer.evm.eosnetwork.com",
  rpcurl: "https://api.evm.eosnetwork.com",
  wssurl: "",
};

export const testnetConfig = {
  id: 15557,
  name: "EOS Testnet Goerli",
  symbol: "EOS",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://explorer.testnet.evm.eosnetwork.com",
  rpcurl: "https://api.testnet.evm.eosnetwork.com",
  wssurl: "",
};

class EOS extends ChainBaseClass {
  chain: Chain = "EOS";
  symbol: ChainSymbol = "EOS";
  logo = "eos.svg";
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

export default EOS;
