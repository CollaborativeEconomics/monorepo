import Wallet from '@/lib/wallets/metamask'
import { WalletProvider } from '@/types/wallet'

type Dictionary = { [key:string]:any }
type Callback = (data:Dictionary)=>void

class FilecoinSDK{
  chainEnabled  = false
  chain    = 'Filecoin'
  coinSymbol   = 'FIL'
  logo     = 'fil.png'
  network  = process.env.NEXT_PUBLIC_FILECOIN_NETWORK || ''
  provider:WalletProvider
  mainnet  = {
    id: 43114,
    name: 'Filecoin Mainnet',
    coinSymbol: 'FIL',
    decimals: 18,
    gasprice: '250000000',
    explorer: 'https://filscan.io',
    rpcurl: 'https://api.node.glif.io/rpc/v1',
    wssurl: ''
  }
  testnet = {
    id: 314159,
    name: 'Filecoin Testnet',
    coinSymbol: 'FIL',
    decimals: 18,
    gasprice: '250000000',
    explorer: 'https://calibration.filscan.io',
    rpcurl: 'https://api.calibration.node.glif.io/rpc/v1',
    wssurl: ''
  }
  hyperspace = {
    id: 43113,
    name: 'Filecoin Hyperspace',
    coinSymbol: 'FIL',
    decimals: 18,
    gasprice: '250000000',
    explorer: 'https://hyperspace.filscan.io',
    rpcurl: 'https://api.hyperspace.node.glif.io/rpc/v1',
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

const Filecoin = new FilecoinSDK()

export default Filecoin