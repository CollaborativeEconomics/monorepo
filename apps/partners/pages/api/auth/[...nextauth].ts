//import { NextApiRequest, NextApiResponse } from 'next/server'
import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
//import FacebookProvider from "next-auth/providers/facebook"
//import GithubProvider from "next-auth/providers/github"
//import TwitterProvider from "next-auth/providers/twitter"
//import Auth0Provider from "next-auth/providers/auth0"
//import Adapter from './adapter.ts' // TESTING
import { getUserByEmail, getOrganizationByEmail } from "utils/registry"

const googleId = process.env.GOOGLE_CLIENT_ID || ""
const googleSecret = process.env.GOOGLE_CLIENT_SECRET || ""

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  //adapter: Adapter(),
  providers: [
    GoogleProvider({
      clientId: googleId,
      clientSecret: googleSecret,
    }),
    /*
    Auth0Provider({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
      version: "2.0",
    })
  */
  ],
  callbacks: {
    async jwt({ token, account, trigger, session }) {
      //console.log('JWT TOKEN', token)
      //token.userRole = "admin"
      // TODO: RETHINK
      if (token?.email) {
        const org = await getOrganizationByEmail(token.email)
        token.orgid = org?.id || ""
        token.orgname = org?.name || ""
        if (!org || org?.error) {
          const user = await getUserByEmail(token.email)
          console.log("USER", user)
          if (user && user.type === 9) {
            //console.log('ADMIN!')
            if (trigger === "update" && session?.orgid) {
              console.log("TOKEN UPDATE", session)
              token.orgid = session.orgid
            } else {
              token.orgid = "dcf20b3e-3bf6-4f24-a3f5-71c2dfd0f46c" // Test environmental
            }
            token.orgname = "Admin"
            token.userRole = "admin"
          } else if (token.userRole !== "admin") {
            //console.log('NOT ADMIN!')
            token.orgname = "User"
          }
        }
      }
      //console.log('JWT TOKEN', token, account)
      return token
    },
    async session({ session, token, user, trigger, newSession }) {
      // Send properties to the client, like an access_token from a provider.
      //session.jti = token.jti
      if (trigger === "update" && newSession?.orgid) {
        console.log("SESSION UPDATE", newSession)
        session.orgid = newSession.orgid
      } else {
        session.orgid = (token?.orgid as string) ?? ""
      }
      session.orgname = (token?.orgname as string) ?? ""
      session.isadmin = token?.userRole === "admin"
      //console.log('SES TOKEN', session, token, user)
      return session
    },
  },
}

export default NextAuth(authOptions)
