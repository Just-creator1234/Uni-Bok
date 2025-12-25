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
          emailVerified: user.emailVerified,
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
    async jwt({ token, user, account, profile }) {
      // Handle credentials sign-in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.slug = user.slug;
        token.emailVerified = user.emailVerified;
      }
  
      // Handle Google sign-in
      if (account?.provider === "google" && profile?.email) {
        try {
          // Check if user exists, create if not
          let dbUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });
  
          if (!dbUser) {
            // Generate slug
            const baseSlug = slugify(
              profile.name || profile.email.split("@")[0],
              {
                lower: true,
                strict: true,
                trim: true,
              }
            );
  
            let slug = baseSlug;
            let counter = 1;
            while (await prisma.user.findUnique({ where: { slug } })) {
              slug = `${baseSlug}-${counter++}`;
            }
  
            // REMOVED: Hardcoded admin check
            // All new Google signups are STUDENT by default
            // Admin roles are assigned ONLY through invite system
  
            // Create user with correct values
            dbUser = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name,
                image: profile.picture,
                emailVerified: true, // Boolean true
                role: "STUDENT", // <-- ALL new Google users are STUDENTS
                slug: slug,
              },
            });
          } else {
            // Update existing Google user to ensure emailVerified is true
            if (!dbUser.emailVerified) {
              dbUser = await prisma.user.update({
                where: { email: profile.email },
                data: {
                  emailVerified: true,
                  image: profile.picture,
                },
              });
            }
          }
  
          // Update token
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.slug = dbUser.slug;
            token.emailVerified = dbUser.emailVerified;
            token.name = dbUser.name;
          }
        } catch (error) {
          console.error("Error handling Google user:", error);
        }
      }
  
      return token;
    },
  
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.slug = token.slug;
        session.user.emailVerified = token.emailVerified;
        session.user.name = token.name || session.user.name;
      }
      return session;
    },
  },
  // REMOVE the events.createUser section - let PrismaAdapter handle creation
  // then we update in the signIn callback

  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
};
