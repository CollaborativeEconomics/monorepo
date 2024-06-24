import Chains from '@/src/libs/chains/client/apis'

export type Dictionary = { [key:string]:any }

export function getChainName(currency:string){
  const chains:Dictionary = {
    'xlm': 'Stellar'
  }
  const name = chains[currency] || 'None'
  return name
}

export function getChainWallet(currency:string){
  const wallets:Dictionary = {
    'xlm': 'Freighter'
  }
  const name = wallets[currency] || 'None'
  return name
}

export function getChainNetwork(chain:string){
  const networks:Dictionary = {
    'Stellar': process.env.NEXT_PUBLIC_STELLAR_NETWORK
  }
  const name = networks[chain] || 'testnet'
  return name
}

const wallets: Dictionary = {
  freighter: { value: 'Freighter', image: '/wallets/freighter.png', enabled: true },
  lobstr:    { value: 'Lobstr',    image: '/wallets/lobstr.png',    enabled: false }
}

const chainWallets: Dictionary = {
  xlm:   [wallets['freighter']]
}

export function getChainWallets(chain: string) {
  return chainWallets[chain.toLowerCase()] ?? [wallets['metamask']]
}

export function getChainsList(){
  const chains = Object.values(Chains).map((chain) => {
    return {
      value:   chain?.chain,
      symbol:  chain?.symbol  || '???',
      image:   '/coins/' + (chain?.logo || 'none.png'),
      enabled: chain?.enabled || false
    }
  })
  return chains
}

export function getChainsMap(){
  let chains:Dictionary = {}
  Object.values(Chains).map((chain) => {
    chains[chain.chain] = {
      symbol:  chain?.symbol  || '???',
      image:   '/coins/' + (chain?.logo || 'none.png'),
      enabled: chain?.enabled || false
    }
  })
  return chains
}
