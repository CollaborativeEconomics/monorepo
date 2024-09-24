import appConfig from "@cfce/app-config"
import type { ChainSlugs, Interfaces, TokenTickerSymbol } from "@cfce/types"
import type { Draft } from "immer" // TS doesn't like it if we don't import this
import { atom } from "jotai"
import { atomWithImmer } from "jotai-immer"

const chainAtom = atomWithImmer<{
  selectedChain: ChainSlugs
  selectedWallet: Interfaces
  selectedToken: TokenTickerSymbol
  exchangeRate: number
}>({
  selectedChain: appConfig.chainDefaults.chain,
  selectedWallet: appConfig.chainDefaults.wallet,
  selectedToken: appConfig.chainDefaults.coin,
  exchangeRate: 0,
})

export const PAYMENT_STATUS = {
  ready: "READY",
  sending: "SENDING",
  minting: "MINTING",
  minted: "MINTED",
  failed: "FAILED",
} as const

interface DonationFormState {
  amount: number
  showUsd: boolean
  emailReceipt: boolean
  name: string
  email: string
  date: Date
  txId: string
  paymentStatus: (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]
}

const donationFormAtom = atomWithImmer<DonationFormState>({
  amount: 0,
  name: "",
  email: "",
  emailReceipt: false,
  showUsd: false,
  date: new Date(),
  txId: "",
  paymentStatus: PAYMENT_STATUS.ready,
})

const amountUSDAtom = atom<number>((get) => {
  const { showUsd, amount } = get(donationFormAtom)
  if (!showUsd) {
    const exchangeRate = get(chainAtom).exchangeRate
    return amount * exchangeRate
  }
  return amount
})

const amountCoinAtom = atom<number>((get) => {
  const { showUsd, amount } = get(donationFormAtom)
  if (showUsd) {
    const exchangeRate = get(chainAtom).exchangeRate
    return amount / exchangeRate
  }
  return amount
})

interface AppSettings {
  theme: "light" | "dark"
  walletAddress: string
  userId: string
}

const appSettingsAtom = atomWithImmer<AppSettings>({
  theme: "light",
  walletAddress: "",
  userId: "",
})

export {
  chainAtom,
  donationFormAtom,
  amountUSDAtom,
  amountCoinAtom,
  appSettingsAtom,
}
