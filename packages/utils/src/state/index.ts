import { atom } from "jotai"
import type { Interface, ChainSlugs } from "@cfce/blockchain-tools"
import type { Prisma } from "@cfce/database"

const chainsState = atom<{
  selectedChain?: ChainSlugs
  selectedWallet?: Interface
}>({
  selectedChain: undefined,
  selectedWallet: undefined,
})

const pendingDonation = atom<Prisma.DonationCreateInput>({})

const donationFormState = atom<{ showUsd: boolean; amount: number }>({
  showUsd: false,
  amount: 0,
})

export { chainsState, pendingDonation, donationFormState }
