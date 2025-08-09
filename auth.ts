import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import { prisma } from "./db/prisma";

export const config: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (user && user.password) {
          const isMatch = compareSync(credentials.password, user.password);
          if (isMatch) {
            return user;
          }
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, user, trigger, token }) {
      if (token?.sub && session.user) {
        (session.user as { id?: string }).id = token.sub;
      }
      if(trigger === "update" && user && session.user) {
        session.user.name = user.name;
      }
      return session;
    }
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
