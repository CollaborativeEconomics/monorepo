"use client";

import Wallet from "@/wallets/metamask";
import Binance from "./common";
import { EthereumClientMixin } from "../Ethereum";

class BinanceClient extends EthereumClientMixin(Binance) {
  constructor({ network = "mainnet" } = { network: "mainnet" }) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    this.wallet = new Wallet(this.provider);
  }
}

export default BinanceClient;
