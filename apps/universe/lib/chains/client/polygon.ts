import Wallet from '@/lib/wallets/metamask'
import { WalletProvider } from '@/types/wallet'

type Dictionary = { [key:string]:any }
type Callback = (data:Dictionary)=>void

class PolygonSDK{
  chainEnabled  = true
  chain    = 'Polygon'
  coinSymbol   = 'MATIC'
  logo     = 'matic.png'
  network  = process.env.NEXT_PUBLIC_POLYGON_NETWORK || ''
  provider:WalletProvider
  mainnet  = {
    id: 137,
    name: 'Polygon Mainnet',
    coinSymbol: 'MATIC',
    decimals: 18,
    gasprice: '2050000000',
    explorer: 'https://polygonscan.com',
    rpcurl: 'https://polygon-rpc.com',
    wssurl: ''
  }
  testnet  = {
    id: 80001,
    name: 'Polygon Testnet',
    coinSymbol: 'MATIC',
    decimals: 18,
    gasprice: '2050000000',
    explorer: 'https://mumbai.polygonscan.com',
    rpcurl: 'https://matic-mumbai.chainstacklabs.com',
    wssurl: ''
  }
  wallet:Wallet

  constructor(){
    this.provider = this.network=='mainnet' ? this.mainnet : this.testnet
    this.wallet = new Wallet(this.provider)
  }

  toWei(num:number){
    const sats = 10**this.provider.decimals
    return num / sats
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
        console.log('Pay connect', data)
        const result = await this.wallet.payment(address, amount, destinTag)
        callback(result)
      })
    } catch(ex:any) {
      console.error(ex)
      callback({error:ex.message})
    }
  }

  async getTransactionInfo(txid:string){
    console.log('Get tx info by txid', txid)
    const info = await this.wallet.getTransactionInfo(txid)
    return info
  }
}

const Polygon = new PolygonSDK()

export default Polygon