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

export const NFT_STATUS = {
  pending: "PENDING",
  minting: "MINTING",
  minted: "MINTED",
  failed: "FAILED",
} as const

interface DonationFormState {
  showUsd: boolean
  NFTStatus: (typeof NFT_STATUS)[keyof typeof NFT_STATUS]
}

const donationFormState = atomWithImmer<DonationFormState>({
  showUsd: false,
  NFTStatus: NFT_STATUS.pending,
})

const pendingDonationState = atomWithImmer<Prisma.DonationCreateInput>({})

export { chainsState, pendingDonationState, donationFormState }
