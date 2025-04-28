import { PrismaAdapter } from "@auth/prisma-adapter"
import appConfig from "@cfce/app-config"
import { prismaClient } from "@cfce/database"
import type { Organization, User } from "@cfce/database/types"
import { registryApi } from "@cfce/utils"
import NextAuth, { type NextAuthResult, type NextAuthConfig } from "next-auth"
import { cookies } from "next/headers"
// --- Workaround imports ---
import { v4 as uuidV4 } from "uuid"
import { getAuthProviders } from "./authConfig"

const generateSessionToken = () => uuidV4()
const fromDate = (time: number, date = Date.now()) =>
  new Date(date + time * 1000)

const providers = getAuthProviders(appConfig.auth)
//console.log("AUTH PROVIDERS", providers, appConfig.auth)

const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prismaClient),
  providers,
  session: {
    // strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async signIn({ user, account, credentials }) {
      // Only for credentials provider
      if (account?.provider === "credentials") {
        if (!user?.id) return false
        const sessionToken = generateSessionToken()
        const maxAge = authOptions.session?.maxAge ?? 30 * 24 * 60 * 60
        const sessionExpiry = fromDate(maxAge)
        await prismaClient.session.create({
          data: {
            sessionToken,
            userId: user.id,
            expires: sessionExpiry,
          },
        })
        const cookieStore = await cookies()
        cookieStore.set({
          name: "next-auth.session-token",
          value: sessionToken,
          expires: sessionExpiry,
        })
      }
      return true
    },
    async session({ session, user }) {
      // session.user is populated from the DB
      const customSession = session as typeof session & {
        orgId?: string
        orgName?: string
        isAdmin?: boolean
        address?: string
        network?: string
        currency?: string
      }
      if (customSession.user?.email) {
        try {
          // Fetch organization data
          const { data: org } = await registryApi.get<Organization>(
            `/organizations?email=${customSession.user.email}`,
          )
          customSession.orgId = org?.id ?? ""
          customSession.orgName = org?.name ?? ""

          // Fetch user data
          const { data: userData } = await registryApi.get<User>(
            `/users?email=${customSession.user.email}`,
          )
          if (userData && userData.type === 9) {
            customSession.orgName = "Admin"
            customSession.isAdmin = true
          } else {
            customSession.isAdmin = false
          }
          // Optionally set address, network, currency if available
          // customSession.address = typeof userData?.address === 'string' ? userData.address : "";
          // customSession.network = typeof userData?.network === 'string' ? userData.network : "testnet";
          // customSession.currency = typeof userData?.currency === 'string' ? userData.currency : "";
          // console.log({customSession})
        } catch (error) {
          customSession.orgName = "User"
          customSession.isAdmin = false
        }
      }
      // Add any other custom fields as needed
      return customSession
    },
  },
  jwt: {
    async encode({ token, secret, maxAge }) {
      const cookieStore = await cookies()
      const cookie = cookieStore.get("next-auth.session-token")
      if (cookie) return cookie.value
      return ""
    },
    async decode({ token, secret }) {
      return null
    },
  },
} // satisfies NextAuthOptions
// REF: https://next-auth.js.org/configuration/nextjs

const nextAuth = NextAuth(authOptions)
const { signIn, signOut } = nextAuth
// \/ \/ \/  some weird TS bug: https://github.com/nextauthjs/next-auth/issues/10568 \/ \/ \/
const auth: NextAuthResult["auth"] = nextAuth.auth
const handlers: NextAuthResult["handlers"] = nextAuth.handlers

export { authOptions, auth, handlers, signIn, signOut }
