import Web3 from "web3";
import Abi721 from "@/contracts/erc721-abi.json";
import Binance from "./common";
import { EthereumServerMixin } from "../Ethereum";

class BinanceServer extends EthereumServerMixin(Binance) {
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

export default BinanceServer;
