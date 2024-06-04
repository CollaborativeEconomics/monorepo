import { WalletProvider } from "./wallet"

export interface Organization {
  id: number
  name: string
  description: string
  defaultAsset: string
  walletProvider: WalletProvider
}