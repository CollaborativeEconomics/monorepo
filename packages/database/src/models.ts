export enum Chain {
  Arbitrum,
  Avalanche,
  Base,
  Binance,
  Celo,
  EOS,
  Ethereum,
  Filecoin,
  Flare,
  Optimism,
  Polygon,
  Stellar,
  XDC,
  XRPL
}

export enum CreditType {
  None,
  Carbon,
  Plastic,
  Biodiversity
}

export interface Account {
  id: string
  access_token: string
  provider: string
  providerAccountId: string
  scope: string
  refresh_token?: string
  expires_at?: Date
  token_type?: string
  type: string
  userId: string
  id_token?: string
  session_state?: string
  user?: User
}

export interface Action {
  id: string
  hookId: string
  actionDefinition: string
  hook?: Hook
}

export interface Artwork {
  id: string
  created: Date
  inactive: boolean
  tokenId: string
  authorId: string
  collectionId: string
  categoryId?: string
  name: string
  description: string
  image: string
  artwork: string
  metadata: string
  media: string
  beneficiaryId: string
  royalties: number
  forsale: boolean
  copies: number
  sold: number
  price: number
  likes: number
  views: number
  tags?: string
  author?: User
  beneficiary?: Organization
  collection?: Collection
  offers?: Offer[]
}

export interface Category {
  id: string
  slug: string
  color?: string
  title: string
  description: string
  image?: string
  initiatives?: Initiative[]
  organizations?: Organization[]
  donations?: Donation[]
  stories?: Story[]
}

export interface Chapter {
  id: string
  created: Date
  inactive: boolean
  slug: string
  name: string
  description: string
  location: string
}

export interface Collection {
  id: string
  created: Date
  inactive: boolean
  curated: boolean
  authorId: string
  name: string
  description: string
  image: string
  taxon: string
  nftcount: number
  artworks?: Artwork[]
  author?: User
  offers?: Offer[]
}

export interface Credit {
  id: string
  providerId: string
  initiativeId: string
  type: CreditType
  description: string
  currency: string
  value: number
  start: Date
  finish?: Date
  filled: boolean
  current?: number
  goal?: number
  initiative?: Initiative
  provider?: Provider
}

export interface Cronjob {
  id: string
  created: Date
  cron: string
  status: number
  result: string
}

export interface Donation {
  id: string
  created: Date
  organizationId: string
  chapterId?: string
  initiativeId?: string
  userId?: string
  paytype?: string
  network?: string
  wallet?: string
  amount: number
  usdvalue: number
  asset?: string
  issuer?: string
  status: number
  categoryId?: string
  chain?: Chain
  category?: Category
  initiative?: Initiative
  organization?: Organization
}

export interface Hook {
  id: string
  orgId: string
  triggerName: string
  actions?: Action[]
  createdAt: Date
}

export interface Initiative {
  id: string
  created: Date
  inactive: boolean
  slug: string
  organizationId: string
  chapterId?: string
  categoryId?: string
  title: string
  description: string
  defaultAsset: string
  imageUri?: string
  start: Date
  finish?: Date
  tag: number
  contractnft?: string
  wallet?: string
  country?: string
  donors: number
  institutions: number
  goal: number
  received: number
  lastmonth: number
  contractcredit?: string
  credits?: Credit[]
  category?: Category
  organization?: Organization
  tiers?: InitiativeTier[]
  nfts?: NFTData[]
  stories?: Story[]
  wallets?: Wallet[]
  donations?: Donation[]
}

export interface InitiativeTier {
  id: string
  created: Date
  inactive: boolean
  organizationId?: string
  chapterId?: string
  initiativeId?: string
  amount: number
  asset?: string
  currency?: string
  issuer?: string
  title: string
  description: string
  initiative?: Initiative
}

export interface NFTData {
  id: string
  created: Date
  donorAddress: string
  userId: string
  organizationId: string
  initiativeId?: string
  metadataUri: string
  imageUri: string
  coinNetwork?: string
  coinLabel?: string
  coinSymbol?: string
  coinValue: number
  usdValue: number
  tokenId: string
  offerId?: string
  status: number
  initiative?: Initiative
  organization?: Organization
  user?: User
}

export interface Offer {
  id: string
  created: Date
  type: number
  artworkId: string
  collectionId: string
  beneficiaryId?: string
  buyerId?: string
  sellerId: string
  offerId: string
  tokenId: string
  price: number
  royalties: number
  wallet: string
  status: number
  artwork?: Artwork
  beneficiary?: Organization
  buyer?: User
  collection?: Collection
  seller?: User
}

export interface Organization {
  id: string
  created: Date
  inactive: boolean
  slug: string
  EIN?: string
  country: string
  description: string
  image?: string
  mailingAddress?: string
  name: string
  phone?: string
  email: string
  url?: string
  categoryId?: string
  featured: boolean
  donors: number
  institutions: number
  received: number
  lastmonth: number
  twitter?: string
  facebook?: string
  goal?: number
  background?: string
  artworks?: Artwork[]
  initiative?: Initiative[]
  nfts?: NFTData[]
  offers?: Offer[]
  category?: Category
  stories?: Story[]
  wallets?: Wallet[]
  donations?: Donation[]
}

export interface Provider {
  id: string
  name: string
  apiUrl: string
  credits?: Credit[]
}

export interface Reward {
  id: string
  name: string
}

export interface Session {
  id: string
  expires?: Date
  sessionToken: string
  userId: string
  user?: User
}

export interface Setting {
  id: string
  name: string
  value: string
}

export interface Story {
  id: string
  created: Date
  inactive: boolean
  organizationId: string
  initiativeId: string
  categoryId?: string
  name: string
  description: string
  amount: number
  image: string
  tokenId?: string
  metadata?: string
  initiative?: Initiative
  organization?: Organization
  category?: Category
  media?: StoryMedia[]
}

export interface StoryMedia {
  id: string
  storyId: string
  media: string
  mime?: string
  story?: Story
}

export interface User {
  id: string
  created: Date
  inactive: boolean
  api_key?: string
  api_key_enabled?: boolean
  email?: string
  emailVerified?: boolean
  image?: string
  name: string
  description?: string
  wallet?: string
  type: number
  Account?: Account[]
  artworks?: Artwork[]
  collections?: Collection[]
  nfts?: NFTData[]
  buyers?: Offer[]
  offers?: Offer[]
  Session?: Session[]
  wallets?: UserWallet[]
}

export interface UserWallet {
  id: string
  address: string
  userId: string
  chain: Chain
  users?: User
}

export interface VerificationToken {
  id: string
  identifier: string
  token: string
  expires: Date
}

export interface Wallet {
  id: string
  organizationId: string
  initiativeId?: string
  address: string
  chain: Chain
  initiatives?: Initiative
  organizations?: Organization
}

