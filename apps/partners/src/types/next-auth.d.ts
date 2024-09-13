import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    orgId?: string
    orgName?: string
    isAdmin?: bool
  }
  interface User extends DefaultUser {
    orgId?: string
    orgName?: string
    isAdmin?: bool
  }
}
