"use client";

import Wallet from "../../wallets/metamask";
import { EthereumClientMixin } from "../Ethereum";
import Blockchain from "./common";

class XinFinClient extends EthereumClientMixin(Blockchain) {
  constructor({ network = "mainnet" } = {}) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    this.wallet = new Wallet(this.provider);
  }
}

export default XinFinClient;
