"use client";

import Wallet from "@/wallets/metamask";
import Flare from "./common";
import { EthereumClientMixin } from "../Ethereum";

class FlareClient extends EthereumClientMixin(Flare) {
  constructor({ network } = { network: "mainnet" }) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    this.wallet = new Wallet(this.provider);
  }
}

export default FlareClient;
