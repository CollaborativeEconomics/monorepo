import Chains from '@/lib/chains/client/apis'

export type Dictionary = { [key:string]:any }

export function getChainName(currency:string){
  const chains:Dictionary = {
    'arb':   'Arbitrum',
    'avax':  'Avalanche',
    'base':  'Base',
    'bnb':   'Binance',
    'celo':  'Celo',
    'eos':   'EOS',
    'eth':   'Ethereum',
    'fil':   'Filecoin',
    'flr':   'Flare',
    'matic': 'Polygon',
    'op':    'Optimism',
    'usdc':  'EthereumUSDC',
    'usdt':  'EthereumUSDT',
    'xdc':   'XDC',
    'xlm':   'Stellar',
    'xrp':   'XRPL'
  }
  const name = chains[currency] || 'None'
  return name
}

export function getChainWallet(currency:string){
  const wallets:Dictionary = {
    'arb':   'Metamask',
    'avax':  'Metamask',
    'base':  'Coinbase',
    'bnb':   'Metamask',
    'celo':  'Metamask',
    'eos':   'Metamask',
    'eth':   'Metamask',
    'fil':   'Metamask',
    'flr':   'Metamask',
    'matic': 'Metamask',
    'op':    'Metamask',
    'pgn':   'Metamask',
    'usdc':  'Metamask',
    'usdt':  'Metamask',
    'xdc':   'Metamask',
    'xlm':   'Freighter',
    'xrp':   'Xaman'
  }
  const name = wallets[currency] || 'None'
  return name
}

export function getChainNetwork(chain:string){
  const networks:Dictionary = {
    'Arbitrum':     process.env.NEXT_PUBLIC_ARBITRUM_NETWORK,
    'Avalanche':    process.env.NEXT_PUBLIC_AVALANCHE_NETWORK,
    'Base':         process.env.NEXT_PUBLIC_BASE_NETWORK,
    'Binance':      process.env.NEXT_PUBLIC_BINANCE_NETWORK,
    'Celo':         process.env.NEXT_PUBLIC_CELO_NETWORK,
    'EOS':          process.env.NEXT_PUBLIC_EOS_NETWORK,
    'Ethereum':     process.env.NEXT_PUBLIC_ETHEREUM_NETWORK,
    'EthereumUSDC': process.env.NEXT_PUBLIC_ETHEREUM_NETWORK,
    'EthereumUSDT': process.env.NEXT_PUBLIC_ETHEREUM_NETWORK,
    'Filecoin':     process.env.NEXT_PUBLIC_FILECOIN_NETWORK,
    'Flare':        process.env.NEXT_PUBLIC_FLARE_NETWORK,
    'Optimism':     process.env.NEXT_PUBLIC_OPTIMISM_NETWORK,
    'Polygon':      process.env.NEXT_PUBLIC_POLYGON_NETWORK,
    'Stellar':      process.env.NEXT_PUBLIC_STELLAR_NETWORK,
    'XDC':          process.env.NEXT_PUBLIC_XDC_NETWORK,
    'XRPL':         process.env.NEXT_PUBLIC_XRPL_NETWORK
  }
  const name = networks[chain] || 'testnet'
  return name
}

const wallets: Dictionary = {
  coinbase:  { value: 'Coinbase',  image: '/wallets/coinbase.png',  chainEnabled: true },
  freighter: { value: 'Freighter', image: '/wallets/freighter.png', chainEnabled: true },
  lobstr:    { value: 'Lobstr',    image: '/wallets/lobstr.png',    chainEnabled: false },
  metamask:  { value: 'Metamask',  image: '/wallets/metamask.png',  chainEnabled: true },
  xaman:     { value: 'Xaman',     image: '/wallets/xaman.png',     chainEnabled: true },
}

const chainWallets: Dictionary = {
  arb:   [wallets['metamask']],
  avax:  [wallets['metamask']],
  base:  [wallets['coinbase']],
  bnb:   [wallets['metamask']],
  celo:  [wallets['metamask']],
  eos:   [wallets['metamask']],
  eth:   [wallets['metamask']],
  fil:   [wallets['metamask']],
  flr:   [wallets['metamask']],
  matic: [wallets['metamask']],
  op:    [wallets['metamask']],
  pgn:   [wallets['metamask']],
  xdc:   [wallets['metamask']],
  xlm:   [wallets['freighter']],
  xrp:   [wallets['xaman']],
}

export function getChainWallets(chain: string) {
  return chainWallets[chain.toLowerCase()] ?? [wallets['metamask']]
}

export function getChainsList(){
  const chains = Object.values(Chains).map((chain) => {
    return {
      value:   chain?.chain,
      coinSymbol:  chain?.coinSymbol  || '???',
      image:   '/coins/' + (chain?.logo || 'none.png'),
      chainEnabled: chain?.chainEnabled || false
    }
  })
  return chains
  //return [
  //  { value: 'Arbitrum', image: 'arbitrum.png', coinSymbol: 'ARB' },
  //  { value: 'Avalanche', image: 'avax.png', coinSymbol: 'AVAX' },
  //  { value: 'Base', image: 'base.png', coinSymbol: 'BASE' },
  //  { value: 'Binance', image: 'bnb.png', coinSymbol: 'BNB' },
  //  { value: 'Celo', image: 'celo.png', coinSymbol: 'CELO' },
  //  { value: 'EOS', image: 'eos.png', coinSymbol: 'EOS' },
  //  { value: 'Ethereum', image: 'eth.png', coinSymbol: 'ETH' },
  //  { value: 'EthereumUSDC', image: 'usdc.png', coinSymbol: 'USDC' },
  //  { value: 'EthereumUSDT', image: 'usdt.png', coinSymbol: 'USDT' },
  //  { value: 'Filecoin', image: 'fil.png', coinSymbol: 'FIL' },
  //  { value: 'Flare', image: 'flr.png', coinSymbol: 'FLR' },
  //  { value: 'Optimism', image: 'op.png', coinSymbol: 'OP' },
  //  { value: 'Polygon', image: 'matic.png', coinSymbol: 'MATIC' },
  //  { value: 'Stellar', image: 'xlm.png', coinSymbol: 'XLM' },
  //  { value: 'XDC', image: 'xdc.png', coinSymbol: 'XDC' },
  //  { value: 'XRPL', image: 'xrp.png', coinSymbol: 'XRP' }
  //]
}

export function getChainsMap(){
  let chains:Dictionary = {}
  Object.values(Chains).map((chain) => {
    chains[chain.chain] = {
      coinSymbol:  chain?.coinSymbol  || '???',
      image:   '/coins/' + (chain?.logo || 'none.png'),
      chainEnabled: chain?.chainEnabled || false
    }
  })
  return chains
  
  //return {
  //  Arbitrum: { image: 'arbitrum.png', coinSymbol: 'ARB' },
  //  Avalanche: { image: 'avax.png', coinSymbol: 'AVAX' },
  //  Base: { image: 'base.png', coinSymbol: 'BASE' },
  //  Binance: { image: 'bnb.png', coinSymbol: 'BNB' },
  //  Celo: { image: 'celo.png', coinSymbol: 'CELO' },
  //  EOS: { image: 'eos.png', coinSymbol: 'EOS' },
  //  Ethereum: { image: 'eth.png', coinSymbol: 'ETH' },
  //  EthereumUSDC: { image: 'usdc.png', coinSymbol: 'USDC' },
  //  EthereumUSDT: { image: 'usdt.png', coinSymbol: 'USDT' },
  //  Filecoin: { image: 'fil.png', coinSymbol: 'FIL' },
  //  Flare: { image: 'flr.png', coinSymbol: 'FLR' },
  //  Optimism: { image: 'op.png', coinSymbol: 'OP' },
  //  Polygon: { image: 'matic.png', coinSymbol: 'MATIC' },
  //  Stellar: { image: 'xlm.png', coinSymbol: 'XLM' },
  //  XDC: { image: 'xdc.png', coinSymbol: 'XDC' },
  //  XRPL: { image: 'xrp.png', coinSymbol: 'XRP' }
  //}

}
