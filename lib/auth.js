import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("No account found with this email");
        if (!user.emailVerified)
          throw new Error("Please verify your email before signing in");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Incorrect password");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          remember: credentials.remember === "true",
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      // Capture Google sign-in email
      if (user?.email) token.email = user.email;

      // Always fetch user from DB
      if (token?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, hasCompletedQuestionnaire: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.hasCompletedQuestionnaire = dbUser.hasCompletedQuestionnaire;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.hasCompletedQuestionnaire =
          token.hasCompletedQuestionnaire;
      }
      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/authChecker`;
    },
  },

  events: {
    async createUser({ user }) {
      const adminEmails = ["jackright198765@gmail.com"];
      await prisma.user.update({
        where: { email: user.email },
        data: {
          role: adminEmails.includes(user.email) ? "ADMIN" : "STUDENT",
        },
      });
    },
  },

  pages: {
    signIn: "/signin",
    error: "/error",
  },
};