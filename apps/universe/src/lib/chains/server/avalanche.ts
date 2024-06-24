import Web3 from 'web3'
import { WalletProvider } from '@/types/wallet'
import Abi721 from '@/lib/chains/contracts/erc721-abi.json'

type Dictionary = { [key:string]:any }
type Callback = (data:Dictionary)=>void

class AvalancheServer {
  chain    = 'Avalanche'
  coinSymbol   = 'AVAX'
  network  = process.env.NEXT_PUBLIC_AVALANCHE_NETWORK
  provider:WalletProvider
  mainnet  = {
    id: 43114,
    name: 'Avalanche Mainnet',
    coinSymbol: 'AVAX',
    decimals: 18,
    gasprice: '250000000',
    explorer: 'https://snowtrace.io', //https://cchain.explorer.avax.network
    rpcurl: 'https://api.avax.network/ext/bc/C/rpc',
    wssurl: ''
  }
  testnet = {
    id: 43113,
    name: 'Avalanche Testnet',
    coinSymbol: 'AVAX',
    decimals: 18,
    gasprice: '250000000',
    explorer: 'https://testnet.snowtrace.io',
    rpcurl: 'https://api.avax-test.network/ext/bc/C/rpc',
    wssurl: ''
  }
  web3:Web3

  constructor(){
    this.provider = this.network=='mainnet' ? this.mainnet : this.testnet
    this.web3 = new Web3(this.provider.rpcurl)
  }

  toHex(str:string){
    return '0x'+parseInt(str).toString(16)
  }

  toWei(num:number){
    const wei = 10**this.provider.decimals
    return num * wei
  }

  fromWei(num:number){
    const wei = 10**this.provider.decimals
    return num / wei
  }

  strToHex(str:string) {
    if(!str){ return '' }
    return '0x'+Buffer.from(str.toString(), 'utf8').toString('hex')
  }

  hexToStr(hex:string, encoding:BufferEncoding='utf8') {
    if(!hex){ return '' }
    return Buffer.from(hex.substr(2), 'hex').toString(encoding)
  }

  async fetchLedger(method:string, params:any){
    let data = {id: '1', jsonrpc: '2.0', method, params}
    let body = JSON.stringify(data)
    let opt  = {method:'POST', headers:{'Content-Type':'application/json'}, body}
    try {
      let res = await fetch(this.provider.rpcurl, opt)
      let inf = await res.json()
      return inf?.result
    } catch(ex:any) {
      console.error(ex)
      return {error:ex.message}
    }
  }

  async sendPayment(address:string, amount:string, destinTag:string, callback:any){
    console.log('Sending payment...')
    const value = this.toWei(parseFloat(amount))
    const secret = process.env.AVALANCHE_MINTER_WALLET_SEED || ''
    //const source = process.env.AVALANCHE_MINTER_WALLET
    const acct = this.web3.eth.accounts.privateKeyToAccount(secret)
    const source = acct.address
    const nonce = await this.web3.eth.getTransactionCount(source, 'latest')
    const memo = this.strToHex(destinTag)
    const tx = {
      from: source, // minter wallet
      to: address,  // receiver
      value: value, // value in wei to send
      data: memo    // memo initiative id
    }
    console.log('TX', tx)
    const signed = await this.web3.eth.accounts.signTransaction(tx, secret)
    const result = await this.web3.eth.sendSignedTransaction(signed.rawTransaction)
    console.log('RESULT', result)
    //const txHash = await this.fetchLedger({method: 'eth_sendTransaction', params: [tx]})
    //console.log({txHash});
  }

  async mintNFT(uri: string, address: string){
    console.log(this.chain, 'server minting NFT to', address, uri)
    const secret   = process.env.AVALANCHE_MINTER_WALLET_SEED || ''
    const acct     = this.web3.eth.accounts.privateKeyToAccount(secret)
    const minter   = acct.address
    const contract = process.env.NEXT_PUBLIC_AVALANCHE_MINTER_CONTRACT || ''
    const instance = new this.web3.eth.Contract(Abi721, contract)
    const noncex   = await this.web3.eth.getTransactionCount(minter, 'latest')
    const nonce    = Number(noncex)
    console.log('MINTER', minter)
    console.log('NONCE', nonce)
    const data = instance.methods.safeMint(address, uri).encodeABI()
    console.log('DATA', data)
    const gasHex = await this.fetchLedger('eth_gasPrice', [])
    const gasPrice = parseInt(gasHex,16)
    console.log('GAS', gasPrice, gasHex)
    const checkGas = await this.fetchLedger('eth_estimateGas', [{from:minter, to:contract, data}])
    const gasLimit = Math.floor(parseInt(checkGas,16) * 1.20)
    console.log('EST', gasLimit, checkGas)
    const gas = { gasPrice, gasLimit }

    const tx = {
      from: minter, // minter wallet
      to: contract, // contract address
      value: '0',   // this is the value in wei to send
      data: data,   // encoded method and params
      gas: gas.gasLimit,
      gasPrice: gas.gasPrice,
      nonce
    }
    console.log('TX', tx)

    const sign = await this.web3.eth.accounts.signTransaction(tx, secret)
    const info = await this.web3.eth.sendSignedTransaction(sign.rawTransaction)
    console.log('INFO', info)
    const hasLogs = info.logs.length>0
    let tokenNum = ''
    if(hasLogs){
      //console.log('LOGS.0', JSON.stringify(info?.logs[0].topics,null,2))
      //console.log('LOGS.1', JSON.stringify(info?.logs[1].topics,null,2))
      tokenNum = ' #'+parseInt((info.logs[0] as any).topics[3] || '0', 16)
    }
    if(info.status==1){
      const tokenId = contract+tokenNum
      const result = {success:true, txid:info?.transactionHash, tokenId}
      console.log('RESULT', result)
      return result
    }
    return {success:false, error:'Something went wrong'}
  }

  async getTransactionInfo(txid:string){
    console.log('Get tx info', txid)
    const info = await this.fetchLedger('eth_getTransactionByHash', [txid])
    if(!info || info?.error){ return {success:false, error:'Error fetching tx info'} }
    const result = {
      success: true,
      account: info?.from,
      destination: info?.to,
      destinationTag: this.hexToStr(info?.input),
      amount: this.fromWei(info?.value)
    }
    return result
  }
}

const Avalanche = new AvalancheServer()

export default Avalanche