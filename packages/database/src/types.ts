export interface ListQuery {
  page?: string
  size?: string
  order?: string
}

export const DonationStatus = {
  pending: 0,
  claimed: 1,
  minting: 2,
  minted: 3,
  rejected: 4,
} as const

export const ReceiptStatus = {
  claim: "Claim",
  failed: "Failed",
  minted: "Minted",
  minting: "Minting",
  pending: "Pending",
  rejected: "Rejected",
} as const
