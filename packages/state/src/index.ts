import appConfig from "@cfce/app-config"
import type {
  ChainSlugs,
  ClientInterfaces,
  TokenTickerSymbol,
} from "@cfce/types"
// import type { Draft } from "immer"
import { atom } from "jotai"
import { atomWithImmer } from "jotai-immer"

const chainAtom = atomWithImmer<{
  selectedChain: ChainSlugs
  selectedWallet: ClientInterfaces
  selectedToken: TokenTickerSymbol
  enabledChains: ChainSlugs[]
  exchangeRate: number
}>({
  selectedChain: appConfig.chainDefaults.chain,
  selectedWallet: appConfig.chainDefaults.wallet,
  selectedToken: appConfig.chainDefaults.coin,
  enabledChains: [],
  exchangeRate: 0.0,
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
  amount: 1,
  name: "",
  email: "",
  emailReceipt: false,
  showUsd: true,
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
