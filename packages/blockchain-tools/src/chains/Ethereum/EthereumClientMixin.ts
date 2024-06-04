// Create a mixin that gives common Ethereum functions to a class
// Most chains use the same functions, so we can reuse the same code

const EthereumClientMixin = (superclass: any) => class extends superclass {
  async connect(callback: (options: Record<string, any>) => void) {
    console.log(this.chain, "connecting...");
    const result = await this.wallet.init(window, this.provider);
    console.log("Metamask session:", result);
    if (result?.address) {
      const data = {
        wallet: "metamask",
        address: result.address,
        chainid: this.provider.id,
        chain: this.chain,
        currency: this.provider.symbol,
        decimals: this.provider.decimals,
        network: this.network,
        token: "",
        topic: "",
      };
      callback(data);
    } else {
      callback(result)
    }
  }

  async sendPayment(
    address: string,
    amount: number,
    destinTag: string,
    callback: (data: Record<string, any>) => void,
  ) {
    console.log(this.chain, "Sending payment...");
    try {
      this.connect(async (data) => {
        console.log('Pay connect', data)
        const result = await this.wallet.payment(address, amount, destinTag)
        callback(result)
      })
    } catch (ex) {
      console.error(ex)
      if (ex instanceof Error) {
        callback({ error: ex.message })
      }
    }
  }

  async sendToken(
    address: string,
    amount: number,
    token: string,
    contract: string,
    destinTag: string,
    callback: any,
  ) {
    console.log(this.chain, "Sending token...");
    try {
      this.connect(async (data) => {
        console.log('Pay connect', data)
        const result = await this.wallet.paytoken(address, amount, token, contract, destinTag)
        callback(result)
      })
    } catch (ex) {
      console.error(ex)
      if (ex instanceof Error) {
        callback({ error: ex.message })
      }
    }
  }

  // not needed, as we have a common implementation
  // async getTransactionInfo(txid:string){
  //   console.log('Get tx info by txid', txid)
  //   const info = await this.wallet.getTransactionInfo(txid)
  //   return info
  // }
}

export default EthereumClientMixin;