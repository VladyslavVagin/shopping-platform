import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import { prisma } from "./db/prisma";

const config = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/sign-in"
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });
        
        if (user && user.password) {
          const isMatch = compareSync(credentials.password as string, user.password);
          if (isMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, user, trigger, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
      }

      if(trigger === 'update') {
        session.user.name = user.name;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user?.role;
        if(user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name }
          })
        }
      }
      return token;
    }
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
