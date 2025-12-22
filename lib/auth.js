// import GoogleProvider from "next-auth/providers/google";
// import Credentials from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import slugify from "slugify";
// import prisma from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// export const authOptions = {
//   adapter: PrismaAdapter(prisma),

//   providers: [
//     Credentials({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user) throw new Error("No account found with this email");
//         if (!user.password)
//           throw new Error("Please sign in with Google instead.");
//         if (!user.emailVerified) throw new Error("Please verify your email");

//         const isValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );
//         if (!isValid) throw new Error("Incorrect password");

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           slug: user.slug,
//           role: user.role,
//           emailVerified: user.emailVerified, // ✅ Added
//           hasCompletedQuestionnaire: user.hasCompletedQuestionnaire, // ✅ Added
//         };
//       },
//     }),

//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60,
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   // lib/auth.js - UPDATED
//   callbacks: {
//     // Remove the signIn callback - handle everything in jwt
//     async jwt({ token, user, account, profile }) {
//       // Initial sign in for credentials (email/password)
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//         token.slug = user.slug;
//         token.emailVerified = user.emailVerified;
//         token.hasCompletedQuestionnaire = user.hasCompletedQuestionnaire;
//       }

//       // For Google OAuth users
//       if (account?.provider === "google" && profile?.email) {
//         try {
//           // Find or create user
//           let dbUser = await prisma.user.findUnique({
//             where: { email: profile.email },
//             select: {
//               id: true,
//               role: true,
//               slug: true,
//               emailVerified: true,
//               hasCompletedQuestionnaire: true,
//               name: true,
//             },
//           });

//           // If user doesn't exist (new Google sign-up), create them
//           if (!dbUser) {
//             // Generate slug
//             const baseSlug = slugify(
//               profile.name || profile.email.split("@")[0],
//               {
//                 lower: true,
//                 strict: true,
//                 trim: true,
//               }
//             );

//             let slug = baseSlug;
//             let counter = 1;
//             while (await prisma.user.findUnique({ where: { slug } })) {
//               slug = `${baseSlug}-${counter++}`;
//             }

//             // Determine role
//             const adminEmails = [
//               "jackright198765@gmail.com",
//               "darlingtonboateng18@gmail.com",
//             ];
//             const isAdmin = adminEmails.includes(profile.email.toLowerCase());

//             // Create new user
//             dbUser = await prisma.user.create({
//               data: {
//                 email: profile.email,
//                 name: profile.name,
//                 image: profile.picture,
//                 emailVerified: new Date(), // Google emails are verified
//                 hasCompletedQuestionnaire: false, // Needs questionnaire
//                 role: isAdmin ? "ADMIN" : "STUDENT",
//                 slug: slug,
//                 // password is null for Google users
//               },
//               select: {
//                 id: true,
//                 role: true,
//                 slug: true,
//                 emailVerified: true,
//                 hasCompletedQuestionnaire: true,
//                 name: true,
//               },
//             });

//             // Mark as new Google user
//             token.isNewGoogleUser = true;
//           }

//           // Update token with user data
//           if (dbUser) {
//             token.id = dbUser.id;
//             token.role = dbUser.role;
//             token.slug = dbUser.slug;
//             token.emailVerified = dbUser.emailVerified;
//             token.hasCompletedQuestionnaire = dbUser.hasCompletedQuestionnaire;
//             token.name = dbUser.name; // Add name to token
//           }
//         } catch (error) {
//           console.error("Error handling Google user:", error);
//         }
//       }

//       return token;
//     },

//     async session({ session, token }) {
//       if (token && session.user) {
//         session.user.id = token.id;
//         session.user.role = token.role;
//         session.user.slug = token.slug;
//         session.user.emailVerified = token.emailVerified;
//         session.user.hasCompletedQuestionnaire =
//           token.hasCompletedQuestionnaire;
//         session.user.name = token.name || session.user.name;

//         // Add flag for new Google users
//         if (token.isNewGoogleUser) {
//           session.user.isNewGoogleUser = true;
//         }
//       }
//       return session;
//     },
//   },

//   events: {
//     async createUser({ user }) {
//       // Generate slug for Google OAuth users only
//       if (user.email && user.name) {
//         const baseSlug = slugify(user.name, {
//           lower: true,
//           strict: true,
//           trim: true,
//         });
//         let slug = baseSlug;
//         let counter = 1;

//         while (await prisma.user.findUnique({ where: { slug } })) {
//           slug = `${baseSlug}-${counter++}`;
//         }

//         await prisma.user.update({
//           where: { email: user.email },
//           data: { slug },
//         });
//       }
//     },
//   },

//   pages: {
//     signIn: "/signin",
//     error: "/auth/error",
//   },
// };

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

            // Admin check
            const baseAdminEmails = [
              "jackright198765@gmail.com",
              "darlingtonboateng18@gmail.com",
            ];
            const envAdmins = process.env.ADDITIONAL_ADMINS?.split(",") || [];
            const adminEmails = [...baseAdminEmails, ...envAdmins];
            const isAdmin = adminEmails.includes(profile.email.toLowerCase());

            // Create user with correct values
            dbUser = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name,
                image: profile.picture,
                emailVerified: true, // Boolean true
                role: isAdmin ? "ADMIN" : "STUDENT",
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
