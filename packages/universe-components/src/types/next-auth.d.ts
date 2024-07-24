import NextAuth, { type DefaultSession } from "next-auth"
import type { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  // Extend session to hold the access_token
  interface Session extends DefaultSession {
    orgId: string
    orgName: string
    isAdmin: string
    userId: string
    address: string
    network: string
    currency: string
  }

  // Extend token to hold the access_token before it gets put into session
  interface JWT extends DefaultJWT {
    userId: string
    address: string
    chain: string
    network: string
    currency: string
    name: string
    email: string
    picture: string
    orgId: string
    orgName: string
    userRole: string
  }
}
