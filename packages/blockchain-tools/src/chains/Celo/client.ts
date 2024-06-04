"use client";

import Wallet from "@/wallets/metamask";
import Celo from "./common";
import { EthereumClientMixin } from "../Ethereum";

class CeloClient extends EthereumClientMixin(Celo) {
  constructor({ network } = { network: "mainnet" }) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    this.wallet = new Wallet(this.provider);
  }
}

export default CeloClient;
