import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    userid: string,
    address: string,
    chain: string,
    chainid: string,
    network: string,
    currency: string
  }
  interface User extends DefaultUser {
    userid?: string,
    address: string,
    chain: string,
    chainid: string,
    network: string,
    currency: string
  }    
}