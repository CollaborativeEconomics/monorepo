export interface WalletProvider {
  id: number
  name: string
  symbol: string
  decimals: number
  gasprice: string
  explorer: string
  rpcurl: string
  wssurl?: string
}


