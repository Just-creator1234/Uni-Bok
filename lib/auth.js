import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import slugify from "slugify";
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

        if (!user.password) {
          throw new Error(
            "This account uses Google sign-in. Please sign in with Google instead."
          );
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Incorrect password");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          slug: user.slug,
          role: user.role,
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      // Allow sign in for credentials provider
      if (account.provider === "credentials") {
        return true;
      }

      // Handle Google OAuth
      if (account.provider === "google") {
        try {
          // Check for existing user with this email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true },
          });

          if (existingUser) {
            // Check if Google account already linked
            const googleAccount = existingUser.accounts.find(
              (acc) => acc.provider === "google"
            );

            if (googleAccount) {
              return true; // Existing Google user, allow sign in
            }

            // Account exists but Google isn't linked - redirect to decision page
            return `/auth/link-account?email=${encodeURIComponent(user.email)}`;
          }

          return true; // New user, continue with creation
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.slug = user.slug;
      }

      if (token?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, slug: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.slug = dbUser.slug;
          token.role = dbUser.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.slug = token.slug;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allow callback URLs to work properly
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;

      return `${baseUrl}/My-blogs`;
    },
  },

  events: {
    async createUser({ user }) {
      const baseSlug = slugify(user.name || "user", { lower: true });
      let slug = baseSlug;
      let counter = 1;

      while (await prisma.user.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }

      await prisma.user.update({
        where: { email: user.email },
        data: { slug },
      });
    },
  },

  pages: {
    signIn: "/signin",
    error: "/auth/error",
    // Add a custom page for account linking decisions
    verifyRequest: "/auth/link-account",
  },
};
