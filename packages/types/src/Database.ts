export interface ListQuery {
  page?: string
  size?: string
  order?: string
}

export const UserType = {
  admin: 9,
  orgAdmin: 1,
  // ???: 5, we think this isn't used anymore
  user: 0,
} as const

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

// Used for identifying entities in token bound accounts model
export const EntityType = {
  all: "all",
  organization: "organization",
  initiative: "initiative",
  event: "event",
  impact: "impact",
  story: "story",
  user: "user",
} as const

// Used in contracts model
export type ContractType = {
  "721": "721"
  "1155": "1155"
  Credits: "Credits"
  CreditaHash: "CreditaHash"
  Factory: "Factory"
  NFTReceipt: "NFTReceipt"
  NFTReceiptHash: "NFTReceiptHash"
  TBAImplementation: "TBAImplementation"
  TBARegistry: "TBARegistry"
  V2E: "V2E"
}
