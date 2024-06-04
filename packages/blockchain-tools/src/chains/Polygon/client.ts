"use client";

import Wallet from "@/wallets/metamask";
import Polygon from "./common";
import { EthereumClientMixin } from "../Ethereum";

class PolygonClient extends EthereumClientMixin(Polygon) {
  constructor({ network } = { network: "mainnet" }) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    this.wallet = new Wallet(this.provider);
  }
}

export default PolygonClient;
