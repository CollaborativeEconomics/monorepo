import NextAuth, { type User } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import {
  getUserByWallet,
  newUser,
  prismaClient,
  type Chain,
} from "@cfce/database"
import { v7 as uuidv7 } from "uuid"
import type { Provider } from "next-auth/providers/index"

interface Credentials {
  address: string
  chain: Chain
  chainId: string
  network: string
  currency: string
}

async function getUserByCredentials(credentials: Credentials) {
  console.log("CREDS", credentials)
  try {
    let user: User | null = await getUserByWallet(credentials?.address || "")
    console.log("USER", user)
    if (!user) {
      const uuid = uuidv7()
      const mail = `_${uuid.substr(0, 8)}@example.com`
      const result = await newUser({
        created: new Date(),
        api_key: uuid,
        name: "Anonymous",
        description: "",
        email: mail,
        emailVerified: false,
        image: "",
        inactive: false,
        wallet: credentials?.address || "",
        wallets: {
          create: [
            {
              chain: credentials?.chain || "",
              address: credentials?.address || "",
            },
          ],
        },
      })
      if (!result.id) {
        return null
      }
      user = result
    }
    const info = {
      id: user?.id,
      name: user?.name || "Anonymous",
      email: user?.email || "test@example.com",
      image: user?.image || "/media/nopic.png",
      address: credentials?.address || "",
      chain: credentials?.chain || "",
      network: credentials?.network || "",
      currency: credentials?.currency || "",
    }
    return info
  } catch (ex) {
    console.error(ex)
    return null
  }
}

const credentialsDefinition = {
  id: { label: "id", type: "text" },
  address: { label: "address", type: "text" },
  chain: { label: "chain", type: "text" },
  chainId: { label: "chainId", type: "text" },
  network: { label: "network", type: "text" },
  currency: { label: "currency", type: "text" },
}

const authProviders: Record<string, Provider> = {
  stellar: CredentialsProvider({
    id: "Stellar",
    name: "Stellar - Lobstr",
    credentials: credentialsDefinition,
    authorize: async (credentials) => {
      try {
        console.log("-Stellar", credentials)
        if (!credentials) {
          return null
        }
        // @ts-expect-error CredentialsProvider not nuanced enough to take complex types
        const user = await getUserByCredentials(credentials)
        return user
      } catch (e) {
        return null
      }
    },
  }),
  google: GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  }),
  github: GithubProvider({
    clientId: process.env.GITHUB_ID ?? "",
    clientSecret: process.env.GITHUB_SECRET ?? "",
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name || profile.login,
        email: profile.email,
        image: profile.avatar_url,
      } as User
    },
  }),
  /*
  auth0:Auth0Provider({
    clientId: process.env.AUTH0_ID,
    clientSecret: process.env.AUTH0_SECRET,
    issuer: process.env.AUTH0_ISSUER,
  }),
  facebook:FacebookProvider({
    clientId: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
  }),
  twitter:TwitterProvider({
    clientId: process.env.TWITTER_ID,
    clientSecret: process.env.TWITTER_SECRET,
    version: "2.0",
  })
*/
}

export default authProviders
