import type {
  ChainSlugs,
  Interface,
  TokenTickerSymbol,
} from "@cfce/blockchain-tools"
import type { Prisma } from "@cfce/database"
import type { Draft } from "immer" // TS doesn't like it if we don't import this
import { atom } from "jotai"
import { atomWithImmer } from "jotai-immer"

const chainsState = atom<{
  selectedChain?: ChainSlugs
  selectedWallet?: Interface
  selectedToken?: TokenTickerSymbol
  exchangeRate: number
}>({
  selectedChain: undefined,
  selectedWallet: undefined,
  selectedToken: undefined,
  exchangeRate: 0,
})

export const NFT_STATUS_MESSAGES = {
  pending: "Claim your NFT",
  minting: "Minting NFT, wait a moment...",
  minted: "NFT minted successfully!",
  failed: "Minting NFT failed!",
} as const

interface DonationFormState {
  showUsd: boolean
  NFTStatusMessage: (typeof NFT_STATUS_MESSAGES)[keyof typeof NFT_STATUS_MESSAGES]
}

const donationFormState = atomWithImmer<DonationFormState>({
  showUsd: false,
  NFTStatusMessage: NFT_STATUS_MESSAGES.pending,
})

const pendingDonationState = atomWithImmer<Prisma.DonationCreateInput>({})

export { chainsState, pendingDonationState, donationFormState }
