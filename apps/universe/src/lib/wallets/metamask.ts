import Web3 from 'web3'
import { WalletProvider } from '@/types/wallet'
import erc20abi from '@/lib/chains/contracts/erc20-abi.json'

export default class Wallet {
  neturl    = ''
  explorer  = ''
  network   = 'testnet'
  chainId   = '0x0'
  accounts?:[any]
  myaccount = ''
  metamask?:any = null
  provider?:WalletProvider
  web3?:any = null

  constructor(provider:WalletProvider){
    this.provider = provider
    this.web3 = new Web3(this.provider.rpcurl)
  }

  async init(window:any, provider:any) {
    console.log('Wallet starting...', provider)
    //console.log('Wallet starting...')
    if (window.ethereum) {
      //console.log('window.ethereum')
      try {
        this.metamask = window.ethereum || null
        this.setListeners()
        this.accounts = await this.metamask?.enable()
        //console.log('Accounts', this.accounts)
        this.myaccount = this.accounts ? this.accounts[0] : ''
        //this.myaccount = this.metamask.selectedAddress
        //this.setNetwork(window.ethereum.chainId)
        //this.loadWallet(window)
        console.log('Metamask current chain', parseInt(window.ethereum.chainId), window.ethereum.chainId)
        if(provider.id !== window.ethereum.chainId){
          await this.changeNetwork(provider)
        }
        return {network:this.network, address:this.myaccount}
      } catch(ex:any) {
        console.error('Error', ex.message)
        return {network:null, address:null}
      }
    } else {
      console.log('Metamask not available')
      return {network:null, address:null}
    }
  }

  toHex(num:number){
    return '0x'+num.toString(16)
  }

  isConnected(window:any){
    return window.ethereum.isConnected() && window.ethereum.selectedAddress
  }

  setListeners() {
    this.metamask.on('connect', (info:any)=>{
      console.log('> onConnect', parseInt(info.chainId), info.chainId);
      this.setNetwork(info.chainId);
      //if(restore){
      //  restore(this.network, this.myaccount)
      //}
      //this.loadWallet();
    });
    this.metamask.on('disconnect', (info:any)=>{
      console.log('> onDisconnect', info)
      //
      console.log('Disconnected')
    });
    this.metamask.on('accountsChanged', (info:any)=>{
      console.log('> onAccounts', info)
      this.accounts = info;
      this.myaccount = info[0];
      console.log('My account', this.myaccount);
      //if(restore){
      //  restore(this.network, this.myaccount)
      //}
      //this.getBalance(this.myaccount);
    });
    this.metamask.on('chainChanged', (chainId:string)=>{
      console.log('> onChainChanged', parseInt(chainId), chainId)
      if(chainId==this.chainId) { console.log('Already on chain', chainId); return; }
      this.setNetwork(chainId)
      //if(restore){
      //  restore(this.network, this.myaccount)
      //}
      //this.loadWallet();
      //this.requestAccount();
      //this.getAccounts();
    })
    this.metamask.on('message', (info:any)=>{
      console.log('> onMessage', info)
    })
    console.log('Listeners set')
  }

  setNetwork(chainId:string) {
    console.log('SetNetwork', chainId)
    //if(!chainId){ chainId = this.metamask.chainId; }
    //const mainnet = (chainId == '0x38') // 0x61 testnet
    //this.network  = mainnet ? 'bsc-mainnet' : 'bsc-testnet'
    //this.neturl   = mainnet ? this.MAINURL : this.TESTURL
    //this.explorer = mainnet ? this.MAINEXP : this.TESTEXP
    //this.chainId  = chainId
    console.log('Network', this.network, this.chainId)
  }

  async changeNetwork(provider:WalletProvider){
    console.log('Metamask changing network to', provider.name, provider.id)
    const chainHex = this.toHex(provider.id)
    try {
      await this.metamask.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainHex }]
      });
    } catch (err:any) {
      console.log('Metamask error', err)
      // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        console.log('Metamask adding network...')
        try {
          await this.metamask.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainHex,
                chainName: provider.name,
                nativeCurrency: { name: provider.coinSymbol, decimals: provider.decimals, coinSymbol: provider.coinSymbol },
                rpcUrls: [provider.rpcurl],
                blockExplorerUrls: [provider.explorer]
              }
            ]
          })
          console.log('Network added!')
        } catch(ex:any) {
          console.error('Metamask error adding network', ex)
        }
      }
    }
  }

  async loadWallet(window:any) {
    console.log('Loading wallet...', this.network);
    this.web3 = new Web3(this.neturl);
    //web3.eth.getChainId().then(id => { console.log('ChainId', id) })
    //console.log('WEB3', web3);
    console.log('VER', this.web3.version)

    if (window.ethereum) {
      //console.log('window.ethereum')
      if(this.metamask.isConnected()) { 
        console.log('Already connected to', this.metamask.chainId); 
        this.getAccounts();
        //this.getAddress(this.getBalance);
      } else {
        console.log('Connecting...')
        const accts = await this.metamask.enable()
        console.log('Enabled:', accts)
        this.getAccounts();
          //this.getAddress().then(adr=>{
          //  console.log('Passed1')
          //  this.getBalance(adr);
          //});
        //});
      }
    } else {
      console.log('Metamask not available')
    }
  }
/*
  // Metamask Events
  async onConnect(info) {
    console.log('onConnect', info);
    // info.chainId
    //this.setNetwork(info.chainId);
    //this.loadWallet();
  }

  async onDisconnect(info) {
    console.log('onDisconnect', info)
    //
    console.log('Disconnected')
  }

  async onAccounts(info) {
    console.log('onAccounts', info)
    this.accounts = info;
    this.myaccount = info[0];
    console.log('My account', this.myaccount);
    this.getBalance(this.myaccount);
  }

  async onChain(chainId) {
    console.log('onChain', chainId)
    if(chainId==this.chainId) { console.log('Already on chain', chainId); return; }
    this.setNetwork(chainId);
    //this.loadWallet();
    //this.requestAccount();
    //this.getAccounts();
  }

  async onMessage(info) {
    console.log('onMessage', info)
  }
*/
  /*
  function requestAccount() {
      this.metamask.request({ method: 'eth_requestAccounts' }).then(onAccounts)
      .catch(err => {
        if (err.code === 4001) {
          console.log('User rejected');
          console.log('Please connect to Metamask wallet');
        } else {
          console.error('Connection error', err);
        }
      });
  }
  */

  // Methods
  getAccountHex(acts:[any]) {
    for (var i = 0; i < acts.length; i++) {
      if(acts[i].type=='eth'){ return acts[i].address }
    }
    return null
  }

  async getAccounts() {
    console.log('Get accounts...')
    this.metamask.request({method: 'eth_requestAccounts'}).then((accts:any)=>{
      this.accounts = accts
      this.myaccount = accts[0]
      console.log('Accounts:', accts)
      console.log('MyAccount:', this.myaccount)
      //onReady(this.myaccount, this.network)
    }).catch((err:any) => { 
      console.log('Error: User rejected')
      console.error(err) 
      //onReady(null, 'User rejected connection'
    });
  }

  async getAddress(oncall:any) {
    console.log('Get address...')
    this.metamask.request({method: 'eth_requestAccounts'}).then((res:any)=>{
      console.log('Account', res)
      this.myaccount = res[0]
      //$('user-address').innerHTML = this.myaccount.substr(0,10)
      oncall(this.myaccount)
    }).catch((err:any) => { 
      console.log('Error: Wallet not connected')
      console.error(err) 
      oncall(null)
    });
  }

  async getBalance(adr:string) {
    console.log('Get balance...')
    const balance = await this.metamask.request({method:'eth_getBalance', params:[adr, 'latest']})
    console.log('Balance:', balance)
    return balance
  }

  async getGasPrice() {
    let gas = await this.metamask.request({method:'eth_gasPrice', params:[]})
    console.log('Average gas price:', parseInt(gas), gas)
    return gas
  }

  async getTransactionInfo(txid:string) {
    let info = await this.metamask.request({method:'eth_getTransactionByHash', params:[txid]})
    console.log('Transaction Info:', info)
    return info
  }

  async callContract(provider:any, abi:any, address:string, method:string, value:string) {
    console.log('Call', address, method)
    let web = new Web3(provider)
    let ctr = new web.eth.Contract(abi, address)
    let gas = { gasPrice: 1000000000, gasLimit: 275000 }
    //let res = ctr.methods[method].call(gas)
    const data = ctr.methods[method]().encodeABI()
    const tx = {
      from: this.myaccount, // my wallet
      to: address,  // contract address
      value: value, // this is the value in wei to send
      data: data    // encoded method and params
    }
    const txHash = await this.metamask.request({method: 'eth_sendTransaction', params: [tx]})
    console.log({txHash})
  }

  async payment(destin:string, amount:string, memo:string){
    function numHex(num:number) { return '0x'+(num).toString(16) }
    function strHex(str:string) { return '0x'+Buffer.from(str.toString(), 'utf8').toString('hex') }
    console.log(`Sending ${amount} to ${destin}...`)
    const gasPrice = await this.getGasPrice() //numHex(20000000000)
    console.log('GAS', parseInt(gasPrice), gasPrice)
    const gas = numHex(210000)
    const wei = numHex(parseFloat(amount) * 10**18)
    const method = 'eth_sendTransaction'
    const tx = {
      from: this.myaccount,
      to: destin,
      value: wei,
      gasPrice,
      gas,
      data: ''
    }
    if(memo){ tx.data = strHex(memo) }
    const params = [tx]
    console.log('TX', params)
    try {
      const result = await this.metamask.request({method,params})
      console.log('TXID:', result)
      return {success:true, txid:result, address:this.myaccount}
    } catch(ex:any) {
      console.error(ex)
      return {success:false, error:ex.message}
    }
  }

  async paytoken(destin:string, amount:string, token:string, contract:string, memo:string){
    function numHex(num:number) { return '0x'+(num).toString(16) }
    function strHex(str:string) { return '0x'+Buffer.from(str.toString(), 'utf8').toString('hex') }
    console.log(`Sending ${amount} ${token} token to ${destin}...`)
    const gasPrice = await this.getGasPrice() //numHex(20000000000)
    console.log('GAS', parseInt(gasPrice), gasPrice)
    const gas = numHex(210000)
    const wei = numHex(parseFloat(amount) * 10**6)  // usdc and usdt only have 6 decs
    const method = 'eth_sendTransaction'
    const ctr = new this.web3.eth.Contract(erc20abi, contract)
    const data = ctr.methods.transfer(destin, wei).encodeABI()
    console.log('Data', data)
    //const count = await this.web3.eth.getTransactionCount(this.myaccount)
    //const nonce = this.web3.utils.toHex(count)
    const tx = {
      from: this.myaccount,
      to: contract,
      value: '0x0',
      gasPrice,
      gas,
      data
    }
    //if(memo){ tx.data = strHex(memo) }
    const params = [tx]
    console.log('TX', params)
    try {
      const result = await this.metamask.request({method,params})
      console.log('TXID', result)
      return {success:true, txid:result, address:this.myaccount}
    } catch(ex:any) {
      console.error(ex)
      return {success:false, error:ex.message}
    }
  }

}

/*
function onWallet() {
  console.log('On wallet');
  if(this.metamask.isConnected()) {
    console.log('Logout');
    this.metamask.enable(); // ???
  } else {
    console.log('Enable');
    this.metamask.enable();
  }
}

async function calcGas(numx, web) {
  let gas = { gasPrice: 20000000000, gasLimit: 25000 };
  let prc = 20000000000;
  if(web){ prc = await web.eth.getGasPrice(); console.log('Gas Price', prc); }
  let est = parseInt(numx, 16);
  let lmt = parseInt(est * 1.15);
  gas.gasPrice = parseInt(prc);
  gas.gasLimit = lmt;
  console.log(gas);
  return gas;
}
*/

// END