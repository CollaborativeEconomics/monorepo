import {
  getOrganizationByEmail,
  getUserByEmail,
  prismaClient,
} from "@cfce/database"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth, { type AuthOptions, type User } from "next-auth"
import authProviders, { AuthTypes } from "./authProviders"

const authConfig: AuthOptions = {
  adapter: PrismaAdapter(prismaClient),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/signin",
  },
  providers: [],
  callbacks: {
    async jwt(args) {
      const { token, user, account, profile, isNewUser, trigger, session } =
        args

      // Handle account-related information
      if (account) {
        token.userId = account?.providerAccountId || ""
        // @ts-ignore TODO: move this to state
        token.address = user?.address || ""
        token.chain = account?.provider || ""
        // @ts-ignore TODO: move this to state
        token.network = user?.network || ""
        // @ts-ignore TODO: move this to state
        token.currency = user?.currency || ""
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token.name = session?.name || ""
        token.email = session?.email || ""
        token.picture = session?.image || "/media/nopic.png"
        if (session?.orgId) {
          token.orgId = session.orgId
        }
      }

      // Handle organization and role-based logic
      if (token?.email) {
        const org = await getOrganizationByEmail(token.email)
        token.orgId = org?.id || token.orgId || ""
        token.orgName = org?.name || ""

        if (!org) {
          const user = await getUserByEmail(token.email)
          if (user && user.type === 9) {
            if (!token.orgId) {
              token.orgId = "dcf20b3e-3bf6-4f24-a3f5-71c2dfd0f46c" // Test environmental
            }
            token.orgName = "Admin"
            token.userRole = "admin"
          } else if (token.userRole !== "admin") {
            token.orgName = "User"
          }
        }
      }

      return token
    },
    async session(args) {
      const { session, token, user, trigger, newSession } = args

      // Handle organization and admin-related updates
      if (trigger === "update" && newSession?.orgId) {
        // @ts-ignore TODO: move this to state
        session.orgId = newSession.orgId
      } else {
        // @ts-ignore TODO: move this to state
        session.orgId = (token?.orgId as string) ?? ""
      }
      // @ts-ignore TODO: move this to state
      session.orgName = (token?.orgName as string) ?? ""
      // @ts-ignore TODO: move this to state
      session.isAdmin = token?.userRole === "admin"

      // Handle user-related updates
      // @ts-ignore TODO: move this to state
      session.userId = (token?.userId as string) || ""
      // @ts-ignore TODO: move this to state
      session.address = (token?.address as string) || ""
      // @ts-ignore TODO: move this to state
      session.network = (token?.network as string) || ""
      // @ts-ignore TODO: move this to state
      session.currency = (token?.currency as string) || ""

      // Ensure session.user exists
      if (!session.user) {
        session.user = {}
      }

      // Update user information
      session.user.name = (token?.name as string) || ""
      session.user.email = (token?.email as string) || ""
      session.user.image = (token?.picture as string) || ""

      // Uncomment if needed:
      // session.decimals = (token?.decimals as string) || '';
      // session.wallet = (token?.wallet as string) || '';

      return session
    },
  },
}

let nextAuth: ReturnType<typeof NextAuth> = NextAuth(authConfig)

export function setAuthProviders(providerSlugs: AuthTypes[]) {
  const providers = providerSlugs
    .map((provider) => authProviders[provider])
    .filter((p) => typeof p !== "undefined")
  authConfig.providers = providers
  nextAuth = NextAuth(authConfig)
}

export { authConfig }
export default nextAuth
