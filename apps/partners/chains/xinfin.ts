import Web3 from 'web3'
import Abi721  from 'chains/contracts/erc721-abi.json'
import Abi1155 from 'chains/contracts/erc1155-abi.json'

type Dictionary = { [key:string]:any }
type Callback = (data:Dictionary)=>void

interface MintResult {
  success?: boolean
  error?: string
  txid?: string
  tokenId?: string
}

class XinfinServer {
  chain    = 'XinFin'
  symbol   = 'XDC'
  network  = process.env.XINFIN_NETWORK
  provider = null
  mainnet  = {
    id: 50,
    name: 'Xinfin Mainnet',
    symbol: 'XDC',
    decimals: 18,
    gasprice: '12500000000',
    explorer: 'https://explorer.xinfin.network',
    rpcurl: 'https://rpc.xinfin.network',
    wssurl: ''
  }
  testnet = {
    id: 51,
    name: 'Xinfin Testnet',
    symbol: 'XDC',
    decimals: 18,
    gasprice: '12500000000',
    explorer: 'https://explorer.apothem.network',
    rpcurl: 'https://rpc.apothem.network',
    wssurl: ''
  }
  web3 = null

  constructor(){
    this.provider = this.network=='mainnet' ? this.mainnet : this.testnet
    this.web3 = new Web3(this.provider.rpcurl)
  }

  toHex(str){
    return '0x'+parseInt(str).toString(16)
  }

  toWei(num){
    const wei = 10**this.provider.decimals
    return num * wei
  }

  fromWei(num){
    const wei = 10**this.provider.decimals
    return num / wei
  }

  strToBytes(str) {
    if(!str){ return '' }
    const hex = Buffer.from(str.toString(), 'utf8')
    //const hex = '0x'+Buffer.from(str.toString(), 'utf8').toString('hex')
    return hex
  }

  strToHex(str) {
    if(!str){ return '' }
    return '0x'+Buffer.from(str.toString(), 'utf8').toString('hex')
  }

  hexToStr(hex, encoding:BufferEncoding='utf8') {
    if(!hex){ return '' }
    return Buffer.from(hex.substr(2), 'hex').toString(encoding)
  }

  addressToHex(adr){
    if(!adr) return null
    return '0x'+adr.substr(3)
  }

  addressToXdc(adr){
    if(!adr) return null
    return 'xdc'+adr.substr(2)
  }

  async fetchLedger(method, params){
    let data = {id: '1', jsonrpc: '2.0', method, params}
    let body = JSON.stringify(data)
    let opt  = {method:'POST', headers:{'Content-Type':'application/json'}, body}
    try {
      let res = await fetch(this.provider.rpcurl, opt)
      let inf = await res.json()
      return inf?.result
    } catch(ex) {
      console.error(ex)
      return {error:ex.message}
    }
  }

  async sendPayment(address, amount, destinTag, callback){
    console.log('BNB Sending payment...')
    const value = this.toWei(amount)
    const secret = process.env.XINFIN_MINTER_SECRET
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
    const secret   = process.env.XINFIN_MINTER_SECRET
    const acct     = this.web3.eth.accounts.privateKeyToAccount(secret)
    const minter   = acct.address
    const contract = process.env.XINFIN_NFT721_CONTRACT
    const instance = new this.web3.eth.Contract(Abi721, contract)
    const noncex   = await this.web3.eth.getTransactionCount(minter, 'latest')
    const nonce    = parseInt(noncex)
    console.log('MINTER', minter)
    console.log('NONCE', nonce)
    const data = instance.methods.safeMint(address, uri).encodeABI()
    console.log('DATA', data)
    const resPrice = await this.fetchLedger('eth_gasPrice', [])
    const gasPrice = parseInt(resPrice,16)
    console.log('GAS', gasPrice, resPrice)
    const resLimit = await this.fetchLedger('eth_estimateGas', [{from:minter, to:contract, data}])
    console.log('EST', parseInt(resLimit,16), resLimit)
    const gasLimit = Math.floor(parseInt(resLimit,16) * 1.20)
    console.log('LIMIT', gasLimit)

    const tx = {
      from: minter, // minter wallet
      to: contract, // contract address
      value: '0',   // this is the value in wei to send
      data: data,   // encoded method and params
      gas: gasLimit,
      gasPrice,
      nonce
    }
    console.log('TX', tx)

    const sign = await this.web3.eth.accounts.signTransaction(tx, secret)
    const info = await this.web3.eth.sendSignedTransaction(sign.rawTransaction)
    console.log('INFO', info)
    const hasLogs = info.logs.length>0
    let tokenNum = ''
    if(hasLogs){
      console.log('LOGS.0', JSON.stringify(info?.logs[0].topics,null,2))
      console.log('LOGS.1', JSON.stringify(info?.logs[1].topics,null,2))
      tokenNum = ' #'+parseInt(info.logs[0].topics[3], 16)
    }
    if(info.status==1){
      const tokenId = contract+tokenNum
      const result = {success:true, txid:info?.transactionHash, tokenId}
      console.log('RESULT', result)
      return result
    }
    return {success:false, error:'Something went wrong'}
  }

  // address is receiver, tokenid is db impact id, uri is ipfs:metadata
  async mintNFT1155(contract: string, address: string, tokenid: string, uri: string):Promise<MintResult>{
    console.log(this.chain, 'server minting NFT to', address, uri)
    const secret   = process.env.XINFIN_MINTER_SECRET
    const acct     = this.web3.eth.accounts.privateKeyToAccount(secret)
    const minter   = acct.address
    //const contract = process.env.XINFIN_NFT1155_CONTRACT
    const instance = new this.web3.eth.Contract(Abi1155, contract)
    const noncex   = await this.web3.eth.getTransactionCount(minter, 'latest')
    const nonce    = parseInt(noncex)
    console.log('MINTER', minter)
    console.log('NONCE', nonce)
    //contract.mint(address account, uint256 id, uint256 amount, bytes memory data)
    //const bytes = Buffer.from(uri, 'utf8')
    const bytes = this.web3.utils.toHex(uri)
    const data = instance.methods.mint(address, tokenid, 1, bytes).encodeABI()
    console.log('DATA', data)
    const gasPrice = await this.fetchLedger('eth_gasPrice', [])
    console.log('GAS', parseInt(gasPrice,16), gasPrice)
    const checkGas = await this.fetchLedger('eth_estimateGas', [{from:minter, to:contract, data}])
    console.log('EST', parseInt(checkGas,16), checkGas)
    const gasLimit = Math.floor(parseInt(checkGas,16) * 1.20)
    console.log('LIMIT', gasLimit)
    //const gas = { gasPrice: this.provider.gasprice, gasLimit: 275000 }
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
      console.log('LOGS.0.data', info?.logs[0].data)
      const num = info?.logs[0].data.substr(0,66)
      //const num = info?.logs[0].data.substr(66)
      //const int = num.replace(/^0+/,'')
      const txt = '0x'+BigInt(num).toString(16)
      tokenNum = contract + ' #' + txt
      //tokenNum = contract + ' #'+parseInt(num)
    }
    if(info.status==1){
      const result = {success:true, txid:info?.transactionHash, tokenId:tokenNum}
      console.log('RESULT', result)
      return result
    }
    return {success:false, error:'Something went wrong'}
  }

  async getTransactionInfo(txid){
    console.log('Get tx info', txid)
    const info = await this.fetchLedger('eth_getTransactionByHash', [txid])
    if(!info || info?.error){ return {success:false, error:'Error fetching tx info'} }
    const result = {
      success: true,
      account: this.addressToHex(info?.from),
      destination: this.addressToHex(info?.to),
      destinationTag: this.hexToStr(info?.input),
      amount: this.fromWei(info?.value)
    }
    return result
  }
}

const Xinfin = new XinfinServer()

export default Xinfin