import Web3 from "web3";
import Ethereum from "./common";
import EthereumServerMixin from "./EthereumServerMixin";

class EthereumServer extends EthereumServerMixin(Ethereum) {
  web3: Web3;
  walletSeed: string;
  contract: string;

  constructor(
    { network, contract, walletSeed } = {
      network: "mainnet",
      contract: "",
      walletSeed: "",
    },
  ) {
    super();
    this.network = network;
    this.walletSeed = walletSeed;
    this.contract = contract;
    this.provider = this.network === "mainnet" ? this.mainnet : this.testnet;
    this.web3 = new Web3(this.provider.rpcurl);
  }
}

export default EthereumServer;
