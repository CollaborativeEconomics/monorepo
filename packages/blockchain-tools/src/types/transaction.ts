export interface Transaction {
  id: string // Transaction ID
  hash: string // Transaction hash
  from: string // Sender address
  to: string // Recipient address
  value: string // Amount transferred
  fee: string // Transaction fee
  timestamp: string // Timestamp of the transaction
  blockNumber: number // Block number in which the transaction is included
}

export interface StellarTransaction extends Transaction {
  pagingToken: string
  successful: boolean
  ledger: number
  createdAt: string
  sourceAccount: string
  sourceAccountSequence: string
  maxFee: string
  operationCount: number
  envelopeXdr: string
  resultXdr: string
  resultMetaXdr: string
  feeMetaXdr: string
  memoType: string
  memo: string
  signatures: string[]
}

export interface EthereumTransaction extends Transaction {
  blockHash: string
  gas: string
  gasPrice: string
  input: string
  nonce: string
  transactionIndex: string
  v: string
  r: string
  s: string
}

export interface XrplTransaction extends Transaction {
  Account: string
  Amount: string
  Destination: string
  Fee: string
  Flags: number
  Sequence: number
  SigningPubKey: string
  TransactionType: string
  TxnSignature: string
  ledgerIndex: number
  meta: object
  validated: boolean
}
