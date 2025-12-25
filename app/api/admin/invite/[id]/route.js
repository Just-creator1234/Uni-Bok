// // /app/api/admin/invite/[id]/route.js
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import prisma from "@/lib/prisma";
// import { v4 as uuidv4 } from "uuid";
// import { addHours } from "date-fns";
// import { sendAdminInviteEmail } from "@/lib/mailer";

// // DELETE - Cancel invite
// export async function DELETE(request, { params }) {
//   try {
//     const session = await getServerSession(authOptions);
    
//     // SUPER_ADMIN only
//     if (!session || session.user.role !== "SUPER_ADMIN") {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const inviteId = params.id;

//     const invite = await prisma.adminInvite.findUnique({
//       where: { id: inviteId }
//     });

//     if (!invite) {
//       return NextResponse.json(
//         { error: "Invite not found" },
//         { status: 404 }
//       );
//     }

//     // Delete the invite
//     await prisma.adminInvite.delete({
//       where: { id: inviteId }
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Invite cancelled successfully"
//     });

//   } catch (error) {
//     console.error("Error cancelling invite:", error);
//     return NextResponse.json(
//       { error: "Failed to cancel invite" },
//       { status: 500 }
//     );
//   }
// }

// // PATCH - Resend invite
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

//     const inviteId = params.id;

//     const invite = await prisma.adminInvite.findUnique({
//       where: { id: inviteId }
//     });

//     if (!invite) {
//       return NextResponse.json(
//         { error: "Invite not found" },
//         { status: 404 }
//       );
//     }

//     // Generate new token and expiry
//     const newToken = uuidv4();
//     const newExpires = addHours(new Date(), 24);

//     // Update invite with new token
//     const updatedInvite = await prisma.adminInvite.update({
//       where: { id: inviteId },
//       data: {
//         token: newToken,
//         expires: newExpires,
//         used: false,
//         usedAt: null
//       }
//     });

//     // Send new email
//     try {
//       await sendAdminInviteEmail(invite.email, newToken);
//     } catch (emailError) {
//       console.error("Failed to resend invite email:", emailError);
//       // Continue even if email fails
//     }

//     return NextResponse.json({
//       success: true,
//       message: `Invite resent to ${invite.email}`,
//       invite: updatedInvite
//     });

//   } catch (error) {
//     console.error("Error resending invite:", error);
//     return NextResponse.json(
//       { error: "Failed to resend invite" },
//       { status: 500 }
//     );
//   }
// }


// /app/api/admin/invite/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";
import { sendAdminInviteEmail } from "@/lib/mailer";

// DELETE - Cancel invite
export async function DELETE(request, { params }) {
  try {
    // ✅ Await params first
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    // SUPER_ADMIN only
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const inviteId = id;

    const invite = await prisma.adminInvite.findUnique({
      where: { id: inviteId }
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Invite not found" },
        { status: 404 }
      );
    }

    // Delete the invite
    await prisma.adminInvite.delete({
      where: { id: inviteId }
    });

    return NextResponse.json({
      success: true,
      message: "Invite cancelled successfully"
    });

  } catch (error) {
    console.error("Error cancelling invite:", error);
    return NextResponse.json(
      { error: "Failed to cancel invite" },
      { status: 500 }
    );
  }
}

// PATCH - Resend invite
export async function PATCH(request, { params }) {
  try {
    // ✅ Await params first
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    // SUPER_ADMIN only
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const inviteId = id;

    const invite = await prisma.adminInvite.findUnique({
      where: { id: inviteId }
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Invite not found" },
        { status: 404 }
      );
    }

    // Generate new token and expiry
    const newToken = uuidv4();
    const newExpires = addHours(new Date(), 24);

    // Update invite with new token
    const updatedInvite = await prisma.adminInvite.update({
      where: { id: inviteId },
      data: {
        token: newToken,
        expires: newExpires,
        used: false,
        usedAt: null
      }
    });

    // Send new email
    try {
      await sendAdminInviteEmail(invite.email, newToken);
    } catch (emailError) {
      console.error("Failed to resend invite email:", emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      message: `Invite resent to ${invite.email}`,
      invite: updatedInvite
    });

  } catch (error) {
    console.error("Error resending invite:", error);
    return NextResponse.json(
      { error: "Failed to resend invite" },
      { status: 500 }
    );
  }
}