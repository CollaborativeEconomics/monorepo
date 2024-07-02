import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    orgid?: string,
    orgname?: string,
    isadmin?: bool
  }
  interface User extends DefaultUser {
    orgid?: string,
    orgname?: string,
    isadmin?: bool
  }    
}