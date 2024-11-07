import appConfig from "@cfce/app-config"
import type { Organization, User } from "@cfce/database/types"
import { registryApi } from "@cfce/utils"
import NextAuth, { type NextAuthResult, type NextAuthConfig } from "next-auth"
import { getAuthProviders } from "./authConfig"

const providers = getAuthProviders(appConfig.auth)

const authOptions: NextAuthConfig = {
  // adapter: PrismaAdapter(prismaClient),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // pages: {
  //   signIn: "/signin",
  // },
  providers,
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
        // const org = await getOrganizationByEmail(token.email)
        const { data: org } = await registryApi.get<Organization>(
          `/organizations?email=${token.email}`,
        )
        token.orgId = org?.id || token.orgId || ""
        token.orgName = org?.name || ""
        if (!org) {
          // const user = await getUserByEmail(token.email)
          const { data: user } = await registryApi.get<User>(
            `/users?email=${token.email}`,
          )
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
      // @ts-ignore
      session.user.id = (token?.userId as string) || ""
      // @ts-ignore TODO: move this to state
      session.address = (token?.address as string) || ""
      // @ts-ignore TODO: move this to state
      session.network = (token?.network as string) || ""
      // @ts-ignore TODO: move this to state
      session.currency = (token?.currency as string) || ""
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

const nextAuth = NextAuth(authOptions)
const { signIn, signOut } = nextAuth
// \/ \/ \/  some weird TS bug: https://github.com/nextauthjs/next-auth/issues/10568 \/ \/ \/
const auth: NextAuthResult["auth"] = nextAuth.auth
const handlers: NextAuthResult["handlers"] = nextAuth.handlers

export { authOptions, auth, handlers, signIn, signOut }
