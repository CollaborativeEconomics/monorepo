"use client";

import Wallet from "@/wallets/metamask";
import Avalanche from "./common";
import { EthereumClientMixin } from "../Ethereum";

class AvalancheClient extends EthereumClientMixin(Avalanche) {
  constructor({ network } = { network: "mainnet" }) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    this.wallet = new Wallet(this.provider);
  }
}

export default AvalancheClient;
