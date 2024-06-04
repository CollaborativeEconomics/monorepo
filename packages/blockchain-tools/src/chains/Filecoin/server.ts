import Web3 from "web3";
import Filecoin, { FilecoinNetworks, filecoinNetworks } from "./common";
import { EthereumServerMixin } from "../Ethereum";

class FilecoinServer extends EthereumServerMixin(Filecoin) {
  web3: Web3;
  contract: string;
  walletSeed: string;
  network: FilecoinNetworks;

  constructor(
    { network, contract, walletSeed } = {
      network: "mainnet" as FilecoinNetworks,
      walletSeed: "",
      contract: "",
    },
  ) {
    super();
    this.contract = contract;
    this.walletSeed = walletSeed;
    this.network = network;
    this.provider = filecoinNetworks[network];
    this.web3 = new Web3(this.provider.rpcurl);
  }

}

export default FilecoinServer;
