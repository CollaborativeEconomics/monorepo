import Web3 from "web3";
import EOS from "./common";
import { EthereumServerMixin } from "../Ethereum";

class EOSServer extends EthereumServerMixin(EOS) {
  web3: Web3;
  walletSeed: string;

  constructor(
    { network, contract, walletSeed } = {
      network: "mainnet",
      contract: "",
      walletSeed: "",
    },
  ) {
    super();
    this.contract = contract;
    this.network = network;
    this.walletSeed = walletSeed;
    this.provider = this.network === "mainnet" ? this.mainnet : this.testnet;
    this.web3 = new Web3(this.provider.rpcurl);
  }
}

export default EOSServer;
