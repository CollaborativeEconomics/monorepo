export interface WalletProvider {
  id: number
  name: string
  symbol: string
  decimals: number
  gasprice: string
  explorer: string
  rpcurl: string
  wssurl?: string
}


export const ReceiptStatus = {
  claim:    'Claim',
  failed:   'Failed',
  minted:   'Minted',
  minting:  'Minting',
  pending:  'Pending',
  rejected: 'Rejected'
}

