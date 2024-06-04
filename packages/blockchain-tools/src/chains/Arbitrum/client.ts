"use client";

import Wallet from "@/wallets/metamask";
import Arbitrum from "./common";
import EthereumClientMixin from "../Ethereum/EthereumClientMixin";

class ArbitrumClient extends EthereumClientMixin(Arbitrum) {
  constructor({ network } = { network: "mainnet" }) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    this.wallet = new Wallet(this.provider);
  }
}

export default ArbitrumClient;
