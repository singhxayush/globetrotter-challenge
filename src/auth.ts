import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {db} from "./lib/db";
// import {getUserByID} from "./data/user";

export const {handlers, auth, signIn, signOut} = NextAuth({
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  events: {},

  callbacks: {
    async session({token, session}) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      return session;
    },
    async jwt({token}) {
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: {strategy: "jwt"},
  ...authConfig,
});
