export interface WalletProvider {
  id: number
  name: string
  coinSymbol: string
  decimals: number
  gasprice: string
  explorer: string
  rpcurl: string
  wssurl?: string
}






