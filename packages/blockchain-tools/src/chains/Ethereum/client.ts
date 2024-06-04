"use client";

import Wallet from "@/wallets/metamask";
import Ethereum from "./common";
import EthereumClientMixin from "./EthereumClientMixin";

class EthereumClient extends EthereumClientMixin(Ethereum) {
  constructor({ network } = { network: "mainnet" }) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    this.wallet = new Wallet(this.provider);
  }
}

export default EthereumClient;
