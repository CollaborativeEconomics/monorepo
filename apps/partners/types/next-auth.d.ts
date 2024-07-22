import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    orgId?: string
    orgname?: string
    isadmin?: bool
  }
  interface User extends DefaultUser {
    orgId?: string
    orgname?: string
    isadmin?: bool
  }
}
