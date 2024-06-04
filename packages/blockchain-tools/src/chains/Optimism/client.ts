"use client";

import Wallet from "@/wallets/metamask";
import Optimism from "./common";
import { EthereumClientMixin } from "../Ethereum";

class OptimismClient extends EthereumClientMixin(Optimism) {
  constructor({ network } = { network: "mainnet" }) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    this.wallet = new Wallet(this.provider);
  }
}

export default OptimismClient;
