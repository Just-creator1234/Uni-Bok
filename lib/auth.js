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
        if (!user.password)
          throw new Error("Please sign in with Google instead.");
        if (!user.emailVerified) throw new Error("Please verify your email");

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
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // KEEP IT SIMPLE - remove the complex signIn callback
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.slug = user.slug;
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
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/Allcourse`;
    },
  },
  events: {
    async createUser({ user }) {
      // Generate slug for Google OAuth users only
      if (user.email && user.name) {
        const baseSlug = slugify(user.name, {
          lower: true,
          strict: true,
          trim: true,
        });
        let slug = baseSlug;
        let counter = 1;

        while (await prisma.user.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${counter++}`;
        }

        await prisma.user.update({
          where: { email: user.email },
          data: { slug },
        });
      }
    },
  },

  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
};
