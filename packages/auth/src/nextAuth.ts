import appConfig from "@cfce/app-config"
import type { Organization, User } from "@cfce/database/types"
import { registryApi } from "@cfce/utils"
import NextAuth, { type NextAuthResult, type NextAuthConfig } from "next-auth"
import { getAuthProviders } from "./authConfig"

const providers = getAuthProviders(appConfig.auth)
//console.log("AUTH PROVIDERS", providers, appConfig.auth)

const authOptions: NextAuthConfig = {
  // adapter: PrismaAdapter(prismaClient),
  providers,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // pages: {
  //   signIn: "/signin",
  // },
  callbacks: {
    async jwt(args) {
      //console.log('AUTH JWT ARGS', args)
      const { token, user, account, profile, isNewUser, trigger, session } =
        args
      // Handle account-related information
      if (account) {
        //console.log('AUTH ACCT', account)
        token.authId = account?.providerAccountId || ""
        token.userId = user?.id || ""
        // @ts-ignore TODO: move this to state
        token.address = user?.address || ""
        //token.chain = account?.provider || ""
        // @ts-ignore TODO: move this to state
        token.network = user?.network || "testnet"
        // @ts-ignore TODO: move this to state
        token.currency = user?.currency || ""
      }
      // Handle session updates
      if (trigger === "update" && session) {
        //console.log('AUTH UPDATE', session)
        token.name = session?.name || ""
        token.email = session?.email || ""
        token.picture = session?.image || "/media/nopic.png"
        if (session?.orgId) {
          token.orgId = session.orgId
        }
      }
      //console.log('TOKEN', token)
      // Handle organization and role-based logic
      if (token?.email) {
        //console.log('AUTH MAIL', token.email)
        try {
          // Fetch organization data
          const { data: org } = await registryApi
            .get<Organization>(`/organizations?email=${token.email}`)
            .catch((error) => {
              console.error("Failed to fetch organization:", error)
              return { data: null }
            })
          console.log('SESSION-ORG', org?.name)

          token.orgId = org?.id || token.orgId || ""
          token.orgName = org?.name || ""

          if (!org) {
            console.log('AUTH NO-ORG')
            try {
              // Fetch user data
              const { data: user } = await registryApi
                .get<User>(`/users?email=${token.email}`)
                .catch((error) => {
                  console.error("Failed to fetch user:", error)
                  return { data: null }
                })
              console.log('USER', user?.email)
              if (user && user.type === 9) {
                //console.log('AUTH ADMIN')
                if (!token.orgId) {
                  token.orgId = "dcf20b3e-3bf6-4f24-a3f5-71c2dfd0f46c" // Test environmental
                }
                token.orgName = "Admin"
                token.userRole = "admin"
              } else if (token.userRole !== "admin") {
                token.orgName = "User"
              }
            } catch (error) {
              console.error("Error in user data fetch:", error)
              // Set default values if API call fails
              token.orgName = "User"
            }
            console.log('ORGID', token.orgId)
          }
        } catch (error) {
          console.error("Error in JWT callback:", error)
          // Set default values if API calls fail
          token.orgName = "User"
        }
      }
      return token
    },
    async session(args) {
      //console.log('AUTH SESSION ARGS', args)
      const { session, token, user, trigger, newSession } = args
      //session.authId = token.authId
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
      //console.log("AUTH SESSION", session)
      //console.log("AUTH TOKEN", token)
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
} // satisfies NextAuthOptions
// REF: https://next-auth.js.org/configuration/nextjs

const nextAuth = NextAuth(authOptions)
const { signIn, signOut } = nextAuth
// \/ \/ \/  some weird TS bug: https://github.com/nextauthjs/next-auth/issues/10568 \/ \/ \/
const auth: NextAuthResult["auth"] = nextAuth.auth
const handlers: NextAuthResult["handlers"] = nextAuth.handlers

export { authOptions, auth, handlers, signIn, signOut }
