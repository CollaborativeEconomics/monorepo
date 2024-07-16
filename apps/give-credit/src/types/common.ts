export interface WalletProvider {
  id: number
  name: string
  symbol: string
  decimals: number
  gasprice: string
  explorer: string
  rpcUrl: string
  wssurl?: string
}
