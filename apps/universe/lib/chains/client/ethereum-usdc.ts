import Wallet from '@/lib/wallets/metamask'
import { WalletProvider } from '@/types/wallet'

type Dictionary = { [key:string]:any }
type Callback = (data:Dictionary)=>void

class EthereumUSDCSDK{
  chainEnabled  = false
  chain    = 'EthereumUSDC'
  coinSymbol   = 'USDC'
  logo     = 'usdc.png'
  contract = process.env.NEXT_PUBLIC_ETHEREUM_USDC_TOKEN_CONTRACT || ''
  network  = process.env.NEXT_PUBLIC_ETHEREUM_NETWORK || ''
  provider:WalletProvider
  mainnet  = {
    id: 1,
    name: 'Ethereum USDC Mainnet',
    coinSymbol: 'USDC',
    decimals: 6,
    gasprice: '250000000',
    explorer: 'https://etherscan.io',
    rpcurl: 'https://ethereum.publicnode.com',
    wssurl: ''
  }
  testnet = {
    id: 5,
    name: 'Ethereum USDC Testnet', // Goerli
    coinSymbol: 'USDC',
    decimals: 6,
    gasprice: '250000000',
    explorer: 'https://goerli.etherscan.io',
    rpcurl: 'https://ethereum-goerli.publicnode.com',
    wssurl: ''
  }
  wallet:Wallet

  constructor(){
    this.provider = this.network=='mainnet' ? this.mainnet : this.testnet
    this.wallet = new Wallet(this.provider)
  }

  toWei(num:number){
    const sats = 10**this.provider.decimals
    return num * sats
  }

  async connect(callback:Callback){
    console.log(this.chain, 'connecting...')
    const result = await this.wallet.init(window, this.provider)
    console.log('Metamask session:', result)
    if(result?.address){
      const data = {
        wallet:   'metamask',
        address:  result.address,
        chainid:  this.provider.id,
        chain:    this.chain,
        currency: this.provider.coinSymbol,
        decimals: this.provider.decimals,
        network:  this.network,
        token:    '',
        topic:    ''
      }
      callback(data)
    } else {
      callback(result)
    }
  }

  async sendPayment(address:string, amount:string, destinTag:string, callback:any){
    console.log(this.chain, 'Sending payment...')
    try {
      this.connect(async (data) => {
        console.log('Pay token', data)
        //const result = await this.wallet.payment(address, amount, destinTag)
        const result = await this.wallet.paytoken(address, amount, this.coinSymbol, this.contract, destinTag)
        callback(result)
      })
    } catch(ex:any) {
      console.error(ex)
      callback({error:ex.message})
    }
  }

  async sendToken(address:string, amount:string, token:string, contract:string, destinTag:string, callback:any){
    console.log(this.chain, 'Sending token...')
    try {
      this.connect(async (data) => {
        console.log('Pay connect', data)
        const result = await this.wallet.paytoken(address, amount, token, contract, destinTag)
        callback(result)
      })
    } catch(ex:any) {
      console.error(ex)
      callback({error:ex.message})
    }
  }

  async getTransactionInfo(txid:string){
    try {
      console.log('Get tx info by txid', txid)
      const info = await this.wallet.getTransactionInfo(txid)
      return info
    } catch(ex:any) {
      console.error(ex)
      return {error:ex.message}
    }
  }
}

const EthereumUSDC = new EthereumUSDCSDK()

export default EthereumUSDC