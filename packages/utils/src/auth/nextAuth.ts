import appConfig from "@cfce/app-config"
import { getOrganizationByEmail, getUserByEmail } from "@cfce/database"
import NextAuth, { type AuthOptions } from "next-auth"
//import type { NextAuthOptions } from "next-auth"
import { getAuthProviders } from "../authConfig"

const providers = getAuthProviders(appConfig.auth)

//console.log({ providers })

/*
export interface AuthOptions {
  adapter?: Adapter;
  callbacks?: Partial<CallbacksOptions>;
  cookies?: Partial<CookiesOptions>;
  debug?: boolean;
  events?: Partial<EventCallbacks>;
  jwt?: Partial<JWTOptions>;
  logger?: Partial<LoggerInstance>;
  pages?: Partial<PagesOptions>;
  providers: Provider[];
  secret?: string;
  session?: Partial<SessionOptions>;
  theme?: Theme;
  useSecureCookies?: boolean;
}
*/

const authOptions: AuthOptions = {
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
      // @ts-ignore
      session.user.id = (token?.userId as string) || ""
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
} // satisfies NextAuthOptions
// REF: https://next-auth.js.org/configuration/nextjs

const nextAuth: ReturnType<typeof NextAuth> = NextAuth(authOptions)

export { authOptions }
export default nextAuth
