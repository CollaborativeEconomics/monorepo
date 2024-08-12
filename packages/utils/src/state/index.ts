import type {
  ChainSlugs,
  Interfaces,
  TokenTickerSymbol,
} from "@cfce/blockchain-tools"
import type { Prisma } from "@cfce/database"
import type { Draft } from "immer" // TS doesn't like it if we don't import this
import { atomWithImmer } from "jotai-immer"
import appConfig from "../appConfig"

const chainsState = atomWithImmer<{
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
  showUsd: boolean
  emailReceipt: boolean
  name: string
  email: string
  paymentStatus: (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]
}

const donationFormState = atomWithImmer<DonationFormState>({
  name: "",
  email: "",
  emailReceipt: false,
  showUsd: false,
  paymentStatus: PAYMENT_STATUS.ready,
})

const pendingDonationState = atomWithImmer<Prisma.DonationCreateInput>({})

export { chainsState, pendingDonationState, donationFormState }
