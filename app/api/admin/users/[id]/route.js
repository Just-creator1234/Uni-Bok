// // /app/api/admin/users/[id]/route.js
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import prisma from "@/lib/prisma";
// import { sendAdminInviteEmail } from "@/lib/mailer";
// import { v4 as uuidv4 } from "uuid";
// import { addHours } from "date-fns";

// export async function PATCH(request, { params }) {
//   try {
//     // Await params
//     const { id } = await params;
//     const session = await getServerSession(authOptions);

//     // SUPER_ADMIN only
//     if (!session || session.user.role !== "SUPER_ADMIN") {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const userId = id;
//     const updateData = await request.json();

//     // Get current user
//     const currentUser = await prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         role: true,
//         isDeleted: true,
//       },
//     });

//     if (!currentUser) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     // Prevent editing deleted users (they should be restored first)
//     if (currentUser.isDeleted) {
//       return NextResponse.json(
//         { error: "Cannot edit a deleted user. Restore them first." },
//         { status: 400 }
//       );
//     }

//     // Check if trying to change SUPER_ADMIN role
//     if (currentUser.role === "SUPER_ADMIN" && updateData.role && updateData.role !== "SUPER_ADMIN") {
//       return NextResponse.json(
//         { error: "Cannot change SUPER_ADMIN role" },
//         { status: 400 }
//       );
//     }

//     // Check if trying to assign SUPER_ADMIN to non-SUPER_ADMIN
//     if (updateData.role === "SUPER_ADMIN" && currentUser.role !== "SUPER_ADMIN") {
//       return NextResponse.json(
//         { error: "Only current SUPER_ADMIN can assign SUPER_ADMIN role" },
//         { status: 400 }
//       );
//     }

//     // Check if trying to assign SUPER_ADMIN to self
//     if (updateData.role === "SUPER_ADMIN" && userId === session.user.id) {
//       return NextResponse.json(
//         { error: "Cannot assign SUPER_ADMIN role to yourself" },
//         { status: 400 }
//       );
//     }

//     let userUpdateData = {
//       name: updateData.name,
//       level: updateData.level,
//       semester: updateData.semester,
//       indexNo: updateData.indexNo,
//     };

//     // Handle role changes
//     if (updateData.role && updateData.role !== currentUser.role) {
//       if (currentUser.role === "STUDENT" && updateData.role === "ADMIN") {
//         // STUDENT → ADMIN: Create invite
//         const token = uuidv4();
//         const expires = addHours(new Date(), 24);

//         // Create or update admin invite
//         await prisma.adminInvite.upsert({
//           where: { email: currentUser.email },
//           update: {
//             token,
//             expires,
//             used: false,
//             usedAt: null,
//             invitedBy: session.user.id,
//           },
//           create: {
//             email: currentUser.email,
//             token,
//             expires,
//             invitedBy: session.user.id,
//             role: "ADMIN",
//           },
//         });

//         // Send invite email
//         try {
//           await sendAdminInviteEmail(currentUser.email, token);
//         } catch (emailError) {
//           console.error("Failed to send admin invite email:", emailError);
//           // Continue even if email fails
//         }
//       }

//       // Update role in user data
//       userUpdateData.role = updateData.role;
//     }

//     // Update user
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: userUpdateData,
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         role: true,
//         level: true,
//         semester: true,
//         indexNo: true,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: `User ${updatedUser.name || updatedUser.email} updated successfully`,
//       user: updatedUser,
//       action: updateData.role !== currentUser.role ?
//         (currentUser.role === "STUDENT" && updateData.role === "ADMIN" ?
//           "Admin invite sent" : "Role updated") :
//         "Details updated",
//     });

//   } catch (error) {
//     console.error("Error updating user:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to update user" },
//       { status: 500 }
//     );
//   }
// }

// /app/api/admin/users/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendAdminInviteEmail } from "@/lib/mailer";
import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";

export async function PATCH(request, { params }) {
  try {
    // Await params
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // SUPER_ADMIN only
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = id;
    const updateData = await request.json();

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isDeleted: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent editing deleted users (they should be restored first)
    if (currentUser.isDeleted) {
      return NextResponse.json(
        { error: "Cannot edit a deleted user. Restore them first." },
        { status: 400 }
      );
    }

    // Check if trying to change SUPER_ADMIN role (can't change existing SUPER_ADMIN)
    if (
      currentUser.role === "SUPER_ADMIN" &&
      updateData.role &&
      updateData.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { error: "Cannot change SUPER_ADMIN role" },
        { status: 400 }
      );
    }

    // Check if trying to assign SUPER_ADMIN to self (prevent self-promotion)
    if (updateData.role === "SUPER_ADMIN" && userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot assign SUPER_ADMIN role to yourself" },
        { status: 400 }
      );
    }

    // Check if trying to promote someone to SUPER_ADMIN who isn't an ADMIN
    if (updateData.role === "SUPER_ADMIN" && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only ADMIN users can be promoted to SUPER_ADMIN" },
        { status: 400 }
      );
    }

    let userUpdateData = {
      name: updateData.name,
      level: updateData.level,
      semester: updateData.semester,
      indexNo: updateData.indexNo,
    };

    // Handle role changes
    if (updateData.role && updateData.role !== currentUser.role) {
      if (currentUser.role === "STUDENT" && updateData.role === "ADMIN") {
        // STUDENT → ADMIN: Create invite
        const token = uuidv4();
        const expires = addHours(new Date(), 24);

        // Create or update admin invite
        await prisma.adminInvite.upsert({
          where: { email: currentUser.email },
          update: {
            token,
            expires,
            used: false,
            usedAt: null,
            invitedBy: session.user.id,
          },
          create: {
            email: currentUser.email,
            token,
            expires,
            invitedBy: session.user.id,
            role: "ADMIN",
          },
        });

        // Send invite email
        try {
          await sendAdminInviteEmail(currentUser.email, token);
        } catch (emailError) {
          console.error("Failed to send admin invite email:", emailError);
          // Continue even if email fails
        }
      }

      // If promoting ADMIN → SUPER_ADMIN, no invite needed
      if (currentUser.role === "ADMIN" && updateData.role === "SUPER_ADMIN") {
        // Direct promotion - no invite needed for SUPER_ADMIN
        // SUPER_ADMIN access is immediate
        // TODO: Send notification email about SUPER_ADMIN access
      }

      // Update role in user data
      userUpdateData.role = updateData.role;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userUpdateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        level: true,
        semester: true,
        indexNo: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User ${
        updatedUser.name || updatedUser.email
      } updated successfully`,
      user: updatedUser,
      action:
        updateData.role !== currentUser.role
          ? currentUser.role === "STUDENT" && updateData.role === "ADMIN"
            ? "Admin invite sent"
            : currentUser.role === "ADMIN" && updateData.role === "SUPER_ADMIN"
            ? "Promoted to SUPER_ADMIN"
            : "Role updated"
          : "Details updated",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}
