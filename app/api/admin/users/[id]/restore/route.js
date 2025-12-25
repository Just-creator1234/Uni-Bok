

// /app/api/admin/users/[id]/restore/route.js
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

    // Check if user exists and is deleted
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is already active
    if (!user.isDeleted) {
      return NextResponse.json(
        { error: "User is already active" },
        { status: 400 }
      );
    }

    // Restore user (soft undelete)
    const restoredUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: false,
        deletedAt: null,
        deleteReason: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isDeleted: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User ${
        restoredUser.name || restoredUser.email
      } has been restored`,
      user: restoredUser,
    });
  } catch (error) {
    console.error("Error restoring user:", error);
    return NextResponse.json(
      { error: "Failed to restore user" },
      { status: 500 }
    );
  }
}
