import Abi721 from "@/contracts/erc721-abi.json";
import Abi1155 from "@/contracts/erc1155-abi.json";

/**
 * Create a mixin that adds Ethereum server functions to a class
 * Most chains use the same functions, so we can reuse the same code
 * @param superclass 
 * @returns 
 */
const EthereumServerMixin = (superclass: any) => class extends superclass {
  async getGasPrice(minter: string, contract: string, data: string) {
    const gasPrice = await this.fetchLedger('eth_gasPrice', [])
    console.log('GAS', parseInt(gasPrice, 16), gasPrice)
    const checkGas = await this.fetchLedger('eth_estimateGas', [{ from: minter, to: contract, data }])
    console.log('EST', parseInt(checkGas, 16), checkGas)
    const gasLimit = Math.floor(parseInt(checkGas, 16) * 1.20)
    return { gasPrice, gasLimit }
  }

  async mintNFT(
    uri: string,
    address: string,
    taxon: number,
    transfer: boolean = false,
  ) {
    console.log(this.chain, "server minting NFT to", address, uri);
    const acct = this.web3.eth.accounts.privateKeyToAccount(this.walletSeed);
    const minter = acct.address;
    const instance = new this.web3.eth.Contract(Abi721, this.contract);
    const noncex = await this.web3.eth.getTransactionCount(minter, "latest");
    const nonce = Number(noncex);
    console.log("MINTER", minter);
    console.log("NONCE", nonce);
    const data = instance.methods.safeMint(address, uri).encodeABI();
    console.log("DATA", data);
    const gas = await this.getGasPrice(minter, this.contract, data);

    const tx = {
      from: minter, // minter wallet
      to: this.contract, // contract address
      value: "0", // this is the value in wei to send
      data: data, // encoded method and params
      gas: gas.gasLimit,
      gasPrice: gas.gasPrice,
      nonce,
    };
    console.log("TX", tx);

    const sign = await this.web3.eth.accounts.signTransaction(
      tx,
      this.walletSeed,
    );
    const info = await this.web3.eth.sendSignedTransaction(sign.rawTransaction);
    console.log("INFO", info);
    const hasLogs = info.logs.length > 0;
    let tokenNum = "";
    if (hasLogs) {
      console.log("LOGS.0", JSON.stringify(info?.logs[0].topics, null, 2));
      console.log("LOGS.1", JSON.stringify(info?.logs[1].topics, null, 2));
      tokenNum = " #" + parseInt((info.logs[0] as any).topics[3] || "0", 16);
    }
    if (info.status == 1) {
      const tokenId = this.contract + tokenNum;
      const result = { success: true, txid: info?.transactionHash, tokenId };
      console.log("RESULT", result);
      return result;
    }
    return { success: false, error: "Something went wrong" };
  }

  // address is receiver, tokenid is db impact id, uri is ipfs:metadata
  async mintNFT1155(
    address: string,
    tokenid: string,
    uri: string,
    contract: string,
  ) {
    console.log(this.chain, "server minting NFT to", address, uri);
    const secret = this.walletSeed;
    const acct = this.web3.eth.accounts.privateKeyToAccount(secret);
    const minter = acct.address;
    const instance = new this.web3.eth.Contract(Abi1155, contract);
    const noncex = await this.web3.eth.getTransactionCount(minter, "latest");
    const nonce = Number(noncex);
    console.log("MINTER", minter);
    console.log("NONCE", nonce);
    //contract.mint(address account, uint256 id, uint256 amount, bytes memory data)
    //const bytes = Buffer.from(uri, 'utf8')
    const bytes = this.web3.utils.toHex(uri);
    const data = instance.methods.mint(address, tokenid, 1, bytes).encodeABI();
    console.log("DATA", data);
    const { gasPrice, gasLimit } = await this.getGasPrice(minter, contract, data);

    const tx = {
      from: minter, // minter wallet
      to: contract, // contract address
      value: "0", // this is the value in wei to send
      data: data, // encoded method and params
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce,
    };
    console.log("TX", tx);

    const sign = await this.web3.eth.accounts.signTransaction(tx, secret);
    const info = await this.web3.eth.sendSignedTransaction(sign.rawTransaction);
    console.log("INFO", info);
    const hasLogs = info.logs.length > 0;
    let tokenNum = "";
    if (hasLogs) {
      //console.log('LOGS.0', JSON.stringify(info?.logs[0].topics,null,2))
      //console.log('LOGS.0.data', info?.logs[0].data)
      const num = (info?.logs[0] as any).data?.substr(0, 66) || "";
      //const num = info?.logs[0].data.substr(66)
      //const int = num.replace(/^0+/,'')
      const txt = "0x" + BigInt(num).toString(16);
      tokenNum = contract + " #" + txt;
      //tokenNum = contract + ' #'+parseInt(num)
    }
    if (info.status == 1) {
      const result = {
        success: true,
        txid: info?.transactionHash,
        tokenId: tokenNum,
      };
      console.log("RESULT", result);
      return result;
    }
    return { success: false, error: "Something went wrong" };
  }

  async createSellOffer(
    tokenId: string,
    destinationAddress: string,
    offerExpirationDate?: string,
  ) {
    console.log("Creating sell offer", tokenId, destinationAddress);
    // TODO: Implementation for creating a sell offer
    throw new Error("createSellOffer method not implemented.");
  }

  async sendPayment(
    address: string,
    amount: number,
    destinTag: string,
    callback: any,
  ) {
    console.log("Sending payment...");
    const value = this.toBaseUnit(amount);
    const acct = this.web3.eth.accounts.privateKeyToAccount(this.walletSeed);
    const source = acct.address;
    const nonce = await this.web3.eth.getTransactionCount(source, "latest");
    const memo = this.strToHex(destinTag);
    const tx = {
      from: source, // minter wallet
      to: address, // receiver
      value: value, // value in wei to send
      data: memo, // memo initiative id
    };
    console.log("TX", tx);
    const signed = await this.web3.eth.accounts.signTransaction(
      tx,
      this.walletSeed,
    );
    const result = await this.web3.eth.sendSignedTransaction(
      signed.rawTransaction,
    );
    console.log("RESULT", result);
    //const txHash = await this.fetchLedger({method: 'eth_sendTransaction', params: [tx]})
    //console.log({txHash});
  }
}

export default EthereumServerMixin;