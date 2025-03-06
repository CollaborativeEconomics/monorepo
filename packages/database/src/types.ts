// Type exports
import type { Prisma } from "@prisma/client"

export type {
  Account,
  Action,
  Artwork,
  Category,
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

// Value exports (enums)
import { Chain, CreditType, InitiativeStatus } from "@prisma/client"
export { Chain, CreditType, InitiativeStatus }

export type StoryWithRelations = Prisma.StoryGetPayload<{
  include: {
    media: true
    organization: true
    initiative: { include: { category: true } }
  }
}>
