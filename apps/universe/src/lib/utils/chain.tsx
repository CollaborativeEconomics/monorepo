import {invert} from 'lodash'

const coinSymbolChainMap: Record<string, string> = {
  Arbitrum: 'arb',
  Avalanche: 'avax',
  Base: 'base',
  Binance: 'bnb',
  Celo: 'celo',
  EOS: 'eos',
  Ethereum: 'eth',
  EthereumUSDC: 'usdc',
  EthereumUSDT: 'usdt',
  Filecoin: 'fil',
  Flare: 'flr',
  Optimism: 'op',
  Polygon: 'matic',
  Stellar: 'xlm',
  XRPL: 'xrp',
  XDC: 'xdc',
} as const;

type ChainName = typeof coinSymbolChainMap[keyof typeof coinSymbolChainMap];
type CoinSymbol = keyof typeof coinSymbolChainMap;

/**
 *
 * @param chain Chain name (e.g. 'Arbitrum')
 * @returns chain symbol (e.g. 'arb')
 */
function coinFromChain(chain: ChainName): CoinSymbol {
  return coinSymbolChainMap[chain];
}

/**
 *
 * @param coin Chain symbol (e.g. 'arb')
 * @returns Chain name (e.g. 'Arbitrum')
 */
function chainFromCoin(coin: CoinSymbol): ChainName {
  return invert(coinSymbolChainMap)[coin];
}

export { coinFromChain, chainFromCoin }
