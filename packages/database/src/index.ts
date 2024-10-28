import { Prisma, PrismaClient } from "@prisma/client"

export const prismaClient = new PrismaClient()
export type {
  Account,
  Action,
  Artwork,
  Category,
  Chain,
  Chapter,
  Collection,
  Contract,
  Credit,
  Cronjob,
  Donation,
  Event,
  EventMedia,
  Hook,
  Initiative,
  InitiativeTier,
  ImpactLink,
  NFTData,
  Offer,
  Organization,
  Provider,
  Reward,
  Session,
  Setting,
  Story,
  StoryMedia,
  TokenBoundAccount,
  User,
  UserWallet,
  VerificationToken,
  Volunteer,
  Wallet,
} from "@prisma/client"

export { Prisma }
export * from "./database/artworks"
export * from "./database/categories"
export * from "./database/chapters"
export * from "./database/collections"
export * from "./database/contracts"
export * from "./database/credits"
export * from "./database/cronjobs"
export * from "./database/donations"
export * from "./database/events"
export * from "./database/hook"
export * from "./database/impact"
export * from "./database/initiatives"
export * from "./database/locations"
export * from "./database/nftData"
export * from "./database/offers"
export * from "./database/organizations"
export * from "./database/providers"
export * from "./database/session"
export * from "./database/settings"
export * from "./database/stories"
export * from "./database/storyMedia"
export * from "./database/tokenBoundAccounts"
export * from "./database/userWallets"
export * from "./database/users"
export * from "./database/volunteers"
export * from "./database/wallets"
