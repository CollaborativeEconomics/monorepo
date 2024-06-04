export const ReceiptStatus = {
  claim: 'Claim',
  failed: 'Failed',
  minted: 'Minted',
  minting: 'Minting',
  pending: 'Pending',
  rejected: 'Rejected'
} as const

export type ReceiptStatus = typeof ReceiptStatus[keyof typeof ReceiptStatus]

export interface ReceiptOrganization {
  name: string
  ein?: string
  address?: string
}

export interface ReceiptDonor {
  name: string
}

export default interface Receipt {
  status: string
  image: string
  organization: ReceiptOrganization
  date: Date
  amount: number
  ticker: string
  amountFiat: number
  fiatCurrencyCode: string
  donor: ReceiptDonor
}