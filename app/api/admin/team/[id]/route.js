// // /app/api/admin/team/[id]/route.js
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import prisma from "@/lib/prisma";

// export async function PATCH(request, { params }) {
//   try {
//     const session = await getServerSession(authOptions);

//     // SUPER_ADMIN only
//     if (!session || session.user.role !== "SUPER_ADMIN") {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const userId = params.id;
//     const { role } = await request.json();

//     // Validate role change
//     if (role !== "STUDENT") {
//       return NextResponse.json(
//         { error: "Can only demote to STUDENT role" },
//         { status: 400 }
//       );
//     }

//     // Get user to demote
//     const userToDemote = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { role: true, email: true }
//     });

//     if (!userToDemote) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     // Check if trying to demote SUPER_ADMIN
//     if (userToDemote.role === "SUPER_ADMIN") {
//       return NextResponse.json(
//         { error: "Cannot demote SUPER_ADMIN" },
//         { status: 400 }
//       );
//     }

//     // Check if trying to demote self
//     if (userToDemote.email === session.user.email) {
//       return NextResponse.json(
//         { error: "Cannot demote yourself" },
//         { status: 400 }
//       );
//     }

//     // Demote user to STUDENT
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: { role: "STUDENT" },
//       select: {
//         id: true,
//         email: true,
//         role: true,
//         name: true
//       }
//     });

//     // TODO: Send notification email here

//     return NextResponse.json({
//       success: true,
//       message: `Successfully demoted ${updatedUser.name || updatedUser.email} to STUDENT`,
//       user: updatedUser
//     });

//   } catch (error) {
//     console.error("Error demoting admin:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /app/api/admin/team/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    // ✅ AWAIT params first
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // SUPER_ADMIN only
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = id;
    const { role } = await request.json();

    // Validate role change
    if (role !== "STUDENT") {
      return NextResponse.json(
        { error: "Can only demote to STUDENT role" },
        { status: 400 }
      );
    }

    // Get user to demote
    const userToDemote = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true },
    });

    if (!userToDemote) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if trying to demote SUPER_ADMIN
    if (userToDemote.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Cannot demote SUPER_ADMIN" },
        { status: 400 }
      );
    }

    // Check if trying to demote self
    if (userToDemote.email === session.user.email) {
      return NextResponse.json(
        { error: "Cannot demote yourself" },
        { status: 400 }
      );
    }

    // Demote user to STUDENT
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: "STUDENT" },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
      },
    });

    // TODO: Send notification email here

    return NextResponse.json({
      success: true,
      message: `Successfully demoted ${
        updatedUser.name || updatedUser.email
      } to STUDENT`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error demoting admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
