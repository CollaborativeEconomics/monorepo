import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
export type {
  Account,
  Action,
  Artwork,
  Category,
  Chapter,
  Collection,
  Credit,
  Cronjob,
  Donation,
  Hook,
  Initiative,
  InitiativeTier,
  NFTData,
  Offer,
  Organization,
  Provider,
  Reward,
  Session,
  Setting,
  Story,
  StoryMedia,
  User,
  UserWallet,
  VerificationToken,
  Wallet
} from '@prisma/client';