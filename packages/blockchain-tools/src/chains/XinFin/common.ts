import ChainBaseClass, { Chain, ChainSymbol } from "../ChainBaseClass";

export const mainnetConfig = {
  id: 50,
  name: "Mainnet",
  symbol: "XDC",
  decimals: 18,
  gasprice: "12500000000",
  explorer: "https://explorer.xinfin.network",
  rpcurl: "https://rpc.xinfin.network",
  wssurl: "",
};

export const testnetConfig = {
  id: 51,
  name: "Testnet",
  symbol: "TXDC",
  decimals: 18,
  gasprice: "12500000000",
  explorer: "https://explorer.apothem.network",
  rpcurl: "https://rpc.apothem.network",
  wssurl: "",
};

class XinFin extends ChainBaseClass {
  chain: Chain = "XinFin";
  symbol: ChainSymbol = "XDC";
  logo = "xdc.svg";
  mainnet = mainnetConfig;
  testnet = testnetConfig;

  constructor({ network = "mainnet" } = {}) {
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
      account: this.addressToHex(info?.from),
      destination: this.addressToHex(info?.to),
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

  addressToHex(adr: string) {
    if (!adr) return null;
    return "0x" + adr.substr(3);
  }

  hexToStr(hex: string, encoding: BufferEncoding = "utf8") {
    if (!hex) {
      return "";
    }
    return Buffer.from(hex.substr(2), "hex").toString(encoding);
  }

  strToBytes(str: string) {
    if (!str) {
      return "";
    }
    const hex = Buffer.from(str.toString(), "utf8");
    //const hex = '0x'+Buffer.from(str.toString(), 'utf8').toString('hex')
    return hex;
  }

  strToHex(str: string) {
    if (!str) {
      return "";
    }
    return "0x" + Buffer.from(str.toString(), "utf8").toString("hex");
  }

  addressToXdc(adr: string) {
    if (!adr) return null;
    return "xdc" + adr.substr(2);
  }

  // TODO: Additional common methods specific to this blockchain
}

export default XinFin;
