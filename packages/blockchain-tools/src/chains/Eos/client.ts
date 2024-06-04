"use client";

import Wallet from "@/wallets/metamask";
import EOS from "./common";
import { EthereumClientMixin } from "../Ethereum";

class EOSClient extends EthereumClientMixin(EOS) {
  constructor({ network } = { network: "mainnet" }) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    this.wallet = new Wallet(this.provider);
  }
}

export default EOSClient;
