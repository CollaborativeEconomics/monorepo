"use client";

import Wallet from "@/wallets/metamask";
import Starknet from "./common";
import EthereumClientMixin from "../Ethereum/EthereumClientMixin";

class StarknetClient extends EthereumClientMixin(Starknet) {
  constructor({ network } = { network: "mainnet" }) {
    super();
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    this.wallet = new Wallet(this.provider);
  }
}

export default StarknetClient;
