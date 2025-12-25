// // /app/api/accept/[token]/route.js
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// // GET - Validate token and get invite details
// export async function GET(request, { params }) {
//   try {
//     const token = params.token;

//     const invite = await prisma.adminInvite.findUnique({
//       where: { token },
//       include: {
//         invitedByUser: {
//           // Changed from 'user'
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             role: true,
//           },
//         },
//       },
//     });

//     if (!invite) {
//       return NextResponse.json(
//         { error: "Invalid or expired invite" },
//         { status: 404 }
//       );
//     }

//     // Check if expired
//     if (new Date(invite.expires) < new Date()) {
//       return NextResponse.json(
//         { error: "Invite has expired" },
//         { status: 410 } // Gone
//       );
//     }

//     // Check if already used
//     if (invite.used) {
//       return NextResponse.json(
//         { error: "Invite has already been used" },
//         { status: 410 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       invite: {
//         email: invite.email,
//         role: invite.role,
//         expires: invite.expires,
//         userExists: !!invite.user,
//         user: invite.user,
//       },
//     });
//   } catch (error) {
//     console.error("Error validating invite:", error);
//     return NextResponse.json(
//       { error: "Failed to validate invite" },
//       { status: 500 }
//     );
//   }
// }

// // POST - Accept the invite (create/update user)
// export async function POST(request, { params }) {
//   try {
//     const token = params.token;
//     const session = await getServerSession(authOptions);
//     const { name, password } = await request.json(); // For new users

//     const invite = await prisma.adminInvite.findUnique({
//       where: { token },
//       include: {
//         invitedByUser: true, // Changed
//       },
//     });

//     if (!invite) {
//       return NextResponse.json(
//         { error: "Invalid or expired invite" },
//         { status: 404 }
//       );
//     }

//     // Validate invite
//     if (new Date(invite.expires) < new Date()) {
//       return NextResponse.json(
//         { error: "Invite has expired" },
//         { status: 410 }
//       );
//     }

//     if (invite.used) {
//       return NextResponse.json(
//         { error: "Invite has already been used" },
//         { status: 410 }
//       );
//     }

//     // Check if user exists
//     if (invite.user) {
//       // User exists - update their role to ADMIN
//       await prisma.user.update({
//         where: { email: invite.email },
//         data: { role: "ADMIN" },
//       });
//     } else {
//       // New user - check if we have required data
//       if (!name || !password) {
//         return NextResponse.json(
//           { error: "Name and password are required for new users" },
//           { status: 400 }
//         );
//       }

//       // Check if email already exists (just in case)
//       const existingUser = await prisma.user.findUnique({
//         where: { email: invite.email },
//       });

//       if (existingUser) {
//         return NextResponse.json(
//           { error: "Email already registered" },
//           { status: 400 }
//         );
//       }

//       // Generate slug
//       const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
//       let slug = baseSlug;
//       let counter = 1;

//       while (await prisma.user.findUnique({ where: { slug } })) {
//         slug = `${baseSlug}-${counter++}`;
//       }

//       // Hash password
//       const bcrypt = require("bcryptjs");
//       const hashedPassword = await bcrypt.hash(password, 12);

//       // Create user with ADMIN role
//       await prisma.user.create({
//         data: {
//           email: invite.email,
//           name,
//           password: hashedPassword,
//           slug,
//           role: "ADMIN",
//           emailVerified: true, // Auto-verify since invite came from SUPER_ADMIN
//           hasRegistered: true,
//         },
//       });
//     }

//     // Mark invite as used
//     await prisma.adminInvite.update({
//       where: { id: invite.id },
//       data: {
//         used: true,
//         usedAt: new Date(),
//       },
//     });

//     // If user is logged in, update their session
//     if (session) {
//       // This will require them to sign in again to get new role
//     }

//     return NextResponse.json({
//       success: true,
//       message: invite.user
//         ? "Your account has been upgraded to ADMIN"
//         : "Account created successfully as ADMIN",
//     });
//   } catch (error) {
//     console.error("Error accepting invite:", error);
//     return NextResponse.json(
//       { error: "Failed to accept invite" },
//       { status: 500 }
//     );
//   }
// }

// /app/api/accept/[token]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET - Validate token and get invite details
export async function GET(request, { params }) {
  try {
    // ✅ AWAIT params first
    const { token } = await params;

    const invite = await prisma.adminInvite.findUnique({
      where: { token },
      include: {
        invitedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Invalid or expired invite" },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date(invite.expires) < new Date()) {
      return NextResponse.json(
        { error: "Invite has expired" },
        { status: 410 }
      );
    }

    // Check if already used
    if (invite.used) {
      return NextResponse.json(
        { error: "Invite has already been used" },
        { status: 410 }
      );
    }

    // Check if user exists by email
    const existingUser = await prisma.user.findUnique({
      where: { email: invite.email },
    });

    return NextResponse.json({
      success: true,
      invite: {
        email: invite.email,
        role: invite.role,
        expires: invite.expires,
        invitedBy: invite.invitedByUser?.name || "System Administrator",
        userExists: !!existingUser,
        user: existingUser,
      },
    });
  } catch (error) {
    console.error("Error validating invite:", error);
    return NextResponse.json(
      { error: "Failed to validate invite" },
      { status: 500 }
    );
  }
}

// POST - Accept the invite (create/update user)
export async function POST(request, { params }) {
  try {
    // ✅ AWAIT params first
    const { token } = await params;
    const session = await getServerSession(authOptions);
    const { name, password } = await request.json(); // For new users

    const invite = await prisma.adminInvite.findUnique({
      where: { token },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Invalid or expired invite" },
        { status: 404 }
      );
    }

    // Validate invite
    if (new Date(invite.expires) < new Date()) {
      return NextResponse.json(
        { error: "Invite has expired" },
        { status: 410 }
      );
    }

    if (invite.used) {
      return NextResponse.json(
        { error: "Invite has already been used" },
        { status: 410 }
      );
    }

    // Check if user exists by email
    const existingUser = await prisma.user.findUnique({
      where: { email: invite.email },
    });

    let user;

    if (existingUser) {
      // User exists - update their role to ADMIN
      user = await prisma.user.update({
        where: { email: invite.email },
        data: { role: "ADMIN" },
      });
    } else {
      // New user - check if we have required data
      if (!name || !password) {
        return NextResponse.json(
          { error: "Name and password are required for new users" },
          { status: 400 }
        );
      }

      // Generate slug
      const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      let slug = baseSlug;
      let counter = 1;

      while (await prisma.user.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user with ADMIN role
      user = await prisma.user.create({
        data: {
          email: invite.email,
          name,
          password: hashedPassword,
          slug,
          role: "ADMIN",
          emailVerified: true, // Auto-verify since invite came from SUPER_ADMIN
          hasRegistered: true,
        },
      });
    }

    // Mark invite as used
    await prisma.adminInvite.update({
      where: { id: invite.id },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    // If user is logged in, update their session
    if (session) {
      // This will require them to sign in again to get new role
    }

    return NextResponse.json({
      success: true,
      message: existingUser
        ? "Your account has been upgraded to ADMIN"
        : "Account created successfully as ADMIN",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error accepting invite:", error);
    return NextResponse.json(
      { error: error.message || "Failed to accept invite" },
      { status: 500 }
    );
  }
}
