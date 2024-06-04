import Web3 from "web3";
import Base from "./common";
import { EthereumServerMixin } from "../Ethereum";

class BaseServer extends EthereumServerMixin(Base) {
  web3: Web3;
  contract: string;
  walletSeed: string;

  constructor(
    { network, contract, walletSeed } = {
      network: "mainnet",
      contract: "",
      walletSeed: "",
    },
  ) {
    super();
    this.network = network;
    this.contract = contract;
    this.walletSeed = walletSeed;
    this.provider = this.network === "mainnet" ? this.mainnet : this.testnet;
    this.web3 = new Web3(this.provider.rpcurl);
  }
}

export default BaseServer;
