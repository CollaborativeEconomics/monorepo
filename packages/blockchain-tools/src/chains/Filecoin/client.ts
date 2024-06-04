"use client";

import Wallet from "@/wallets/metamask";
import Filecoin, { FilecoinNetworks, filecoinNetworks } from "./common";
import { EthereumClientMixin } from "../Ethereum";

class FilecoinClient extends EthereumClientMixin(Filecoin) {
  constructor(
    { network }: { network: FilecoinNetworks } = { network: "mainnet" },
  ) {
    super();
    this.network = network;
    this.provider = filecoinNetworks[network];
    this.wallet = new Wallet(this.provider);
  }
}

export default FilecoinClient;
