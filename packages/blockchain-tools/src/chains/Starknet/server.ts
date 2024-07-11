import Web3 from "web3";
import { constants, Account, Contract, Provider, RpcProvider } from 'starknet'
// import { v4 as uuid4 } from 'uuid'
import Abi721 from "@/contracts/solidity/erc721/erc721-abi.json";
import Arbitrum from "./common";
import { EthereumServerMixin } from "../Ethereum";

class ArbitrumServer extends EthereumServerMixin(Arbitrum) {
  web3: Web3;
  contract: string;
  walletSeed: string;

  constructor(
    { network, contract, walletSeed } = {
      network: "mainnet",
      contract: "",
      walletSeed: "",
    },
  ) {
    super();
    this.network = network;
    this.contract = contract;
    this.walletSeed = walletSeed;
    this.provider = this.network === "mainnet" ? this.mainnet : this.testnet;
    this.web3 = new Web3(this.provider.rpcurl);
  }

  async mintNFT(uri: string, address: string, taxon: number, transfer?: boolean): Promise<{ success: boolean; txid: any; tokenId: string; } | { success: boolean; error: string; }> {
    try {

      const provider = new RpcProvider({ nodeUrl: process.env.STARKNET_RPC_URI || '' })
      const privkey = process.env.STARKNET_MINTER_PRIVATE || ''
      const account = new Account(provider, address, privkey)
      const contract = new Contract(Abi721, this.contract, provider);
      contract.connect(account)
      const minted = await contract.safe_mint(address, uri, [])
      console.log('MINTED', minted)
      return { success: true, txid: minted, tokenId: uri }
    } catch (error) {
      let msg = 'Error minting NFT'
      if (error instanceof Error) {
        console.error(error.message)
        msg = error.message
      }
      return { success: false, error: msg }
    }
  }
}

export default ArbitrumServer;
