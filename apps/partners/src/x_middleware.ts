// @ts-nocheck
import { auth } from "@cfce/auth"

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default auth((req) => {
  // const token = await auth(req);
  // pages: {
  //   signIn: "/",
  // },
  // callbacks: {
  //   authorized({ req, token }) {
  //console.log('TOKEN', token)
  // `/admin` requires admin role
  if (req.nextUrl.pathname === "/admin") {
    return req.auth?.isAdmin
  }

  const orgId = req.auth?.orgId
  // `/dashboard/*` requires the user to be org/owner
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    return !!orgId
  }
})

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/organization",
    "/dashboard/donations",
    "/dashboard/initiatives",
    "/dashboard/stories",
    "/dashboard/events",
    "/dashboard/wallets",
    "/dashboard/contracts",
  ],
//  unstable_allowDynamic: [
//    // "**/.pnpm/**/node_modules/lodash-es/*.js",
//    "**/.pnpm/**/node_modules/lodash/**/*.js",
//    "**/.pnpm/**/node_modules/@stellar/stellar-sdk/**/*.js",
//    "**/.pnpm/**/node_modules/web3/**/*.js",
//    "**/.pnpm/**/node_modules/@cfce/blockchain-tools/**/*.js",
//    "**/packages/@cfce/blockchain-tools/**/*.js",
//    "**/.pnpm/**/node_modules/web3/lib/**/*.js",
//    "**/.pnpm/**/node_modules/web3/lib/esm/**/*.js",
//    "**/.pnpm/**/node_modules/web3/lib/commonjs/**/*.js",
//    "**/.pnpm/**/node_modules/web3/dist/**/*.min.js",
//    "**/.pnpm/**/node_modules/web3/src/**/*.ts",
//  ],

}
