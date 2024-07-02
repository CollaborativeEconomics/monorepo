import NextAuth, { User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prismaClient } from "@cfce/database";


export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prismaClient),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        } as User
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    session: async (session, user) => {
      // session.userId = user.id;
      return Promise.resolve(session);
    },
  },
};

// @ts-ignore
export default NextAuth(authOptions);
