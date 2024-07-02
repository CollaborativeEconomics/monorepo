import { withAuth } from "next-auth/middleware"

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  pages: {
    signIn: '/'
  },
  callbacks: {
    authorized({ req, token }) {
      //console.log('TOKEN', token)
      // `/admin` requires admin role
      if (req.nextUrl.pathname === "/admin") {
        return token?.userRole === "admin"
      }
      // `/dashboard/*` requires the user to be org/owner
      if (req.nextUrl.pathname.startsWith('/dashboard')) {
        return !!token?.orgid
      }
      return !!token
    }
  }
})

export const config = { matcher: [
  '/admin', 
  '/dashboard',
  '/dashboard/donations',
  '/dashboard/stories',
  '/dashboard/initiatives',
  '/dashboard/wallets'
] }
