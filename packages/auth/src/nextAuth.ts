import appConfig from "@cfce/app-config"
import type { Organization, User } from "@cfce/database/types"
import { registryApi } from "@cfce/utils"
import NextAuth, { type NextAuthResult, type NextAuthConfig } from "next-auth"
import { getAuthProviders } from "./authConfig"
import { prismaClient } from "@cfce/database"
import { PrismaAdapter } from "@auth/prisma-adapter"

const providers = getAuthProviders(appConfig.auth)
//console.log("AUTH PROVIDERS", providers, appConfig.auth)

const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prismaClient),
  providers,
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async session({ session, user }) {
      // session.user is populated from the DB
      const customSession = session as typeof session & {
        orgId?: string;
        orgName?: string;
        isAdmin?: boolean;
        address?: string;
        network?: string;
        currency?: string;
      };
      if (customSession.user?.email) {
        try {
          // Fetch organization data
          const { data: org } = await registryApi.get<Organization>(`/organizations?email=${customSession.user.email}`);
          customSession.orgId = org?.id ?? "";
          customSession.orgName = org?.name ?? "";

          // Fetch user data
          const { data: userData } = await registryApi.get<User>(`/users?email=${customSession.user.email}`);
          if (userData && userData.type === 9) {
            customSession.orgName = "Admin";
            customSession.isAdmin = true;
          } else {
            customSession.isAdmin = false;
          }
          // Optionally set address, network, currency if available
          // customSession.address = typeof userData?.address === 'string' ? userData.address : "";
          // customSession.network = typeof userData?.network === 'string' ? userData.network : "testnet";
          // customSession.currency = typeof userData?.currency === 'string' ? userData.currency : "";
          // console.log({customSession})
        } catch (error) {
          customSession.orgName = "User";
          customSession.isAdmin = false;
        }
      }
      // Add any other custom fields as needed
      return customSession;
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
