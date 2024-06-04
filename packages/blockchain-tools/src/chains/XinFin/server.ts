import { Web3 } from "web3";

import XinFin from "./common";
import { EthereumServerMixin } from "../Ethereum";

class XinFinServer extends EthereumServerMixin(XinFin) {
  web3: Web3;
  walletSeed: string;

  constructor(
    { network, walletSeed } = { network: "mainnet", walletSeed: "" },
  ) {
    super();
    this.network = network;
    this.walletSeed = walletSeed;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    this.web3 = new Web3(this.provider.rpcurl);
  }
}

export default XinFinServer;
