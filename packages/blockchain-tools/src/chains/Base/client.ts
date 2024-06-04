"use client";

import Wallet from "@/wallets/metamask";
import Base from "./common";
import { EthereumClientMixin } from "../Ethereum";

class BaseClient extends EthereumClientMixin(Base) {
  constructor({ network } = { network: "mainnet" }) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    this.wallet = new Wallet(this.provider);
  }
}

export default BaseClient;
