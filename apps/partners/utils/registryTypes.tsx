// From registry/prisma/models

export enum Chain {
  XRPL
}

export interface User {
  id?: string;
  api_key: string;
  email: string;
  emailVerified?: boolean;
  image: string;
  name: string;
  description: string;
  wallet: string;
  type: number;
  created: Date;
  inactive: boolean;
}

export interface Category {
  id?: string;
  color: string;
  description: string;
  slug: string;
  title: string;
}

export interface Organization {
  id?: string;
  EIN: string;
  country: string;
  description: string;
  image: string;
  mailingAddress: string;
  name: string;
  phone: string;
  url: string;
  categoryId: string;
}

export interface Collection {
  id?: string;
  created: Date;
  name: string;
  description: string;
  authorId: string;
  image: string;
  taxon: string;
  nftcount: number;
  curated: boolean;
  inactive: boolean;
}

export interface Artwork {
  id?: string;
  created: Date;
  tokenId: string;
  authorId: string;
  collectionId: string;
  name: string;
  description: string;
  image: string;
  artwork: string;
  metadata: string;
  media: string;
  royalties: number;
  beneficiaryId: string;
  forsale: boolean;
  copies: number;
  sold: number;
  price: number;
  tags: string;
  likes: number;
  views: number;
  category: string;
  inactive: boolean;
}

export interface NftData {
  id?: string;
  created: Date;
  donorAddress: string;
  organizationId: string;
  metadataUri: string;
  imageUri: string;
  coinNetwork: string;
  coinLabel: string;
  coinSymbol: string;
  coinValue: string;
  usdValue: string;
  tokenId: string;
  offerId: string;
  status: number;
}

export interface Offer {
  id?: string;
  created: Date;
  type: number;
  sellerId: string;
  collectionId: string;
  artworkId: string;
  tokenId: string;
  price: number;
  royalties: number;
  buyerId?: string;
  beneficiaryId?: string;
  wallet: string;
  offerId: string;
  status: number;
}

export interface Wallet {
  id: string;
  address: string;
  chain: Chain;
  organizationId: string;
}
