"use client";

import Wallet from "@/wallets/metamask";
import EthereumClient from "./client";
import { Chain, ChainSymbol } from "../ChainBaseClass";

class EthereumUSDTClient extends EthereumClient {
  contract: string;
  chain = "EthereumUSDT" as Chain;
  symbol = "USDT" as ChainSymbol;
  logo = "usdc.svg";
  mainnet = {
    id: 1,
    name: "Ethereum Mainnet",
    symbol: "USDT",
    decimals: 6,
    gasprice: "250000000",
    explorer: "https://etherscan.io",
    rpcurl: "https://ethereum.publicnode.com",
    wssurl: "",
  };
  testnet = {
    id: 5,
    name: "Ethereum Testnet", // Goerli
    symbol: "USDT",
    decimals: 6,
    gasprice: "250000000",
    explorer: "https://goerli.etherscan.io",
    rpcurl: "https://ethereum-goerli.publicnode.com",
    wssurl: "",
  };
  constructor({ network, contract } = { network: "mainnet", contract: "" }) {
    super();
    if (!contract) throw new Error("USDC contract address is required");
    this.contract = contract;
    this.network = network;
    this.provider = network === "mainnet" ? this.mainnet : this.testnet;
    this.wallet = new Wallet(this.provider);
  }

  async sendPayment(
    address: string,
    amount: number,
    destinTag: string,
    callback: any,
  ) {
    console.log(this.chain, "Sending payment...");
    try {
      this.connect(async (data) => {
        console.log('Pay token', data)
        //const result = await this.wallet.payment(address, amount, destinTag)
        const result = await this.wallet.paytoken(address, amount, this.symbol, this.contract, destinTag)
        callback(result)
      })
    } catch (ex: any) {
      console.error(ex)
      callback({ error: ex.message })
    }
  }
}

export default EthereumUSDTClient;
