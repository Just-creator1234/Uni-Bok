// /app/api/admin/users/[id]/delete/route.js
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
    const { reason } = await request.json();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting SUPER_ADMIN
    if (user.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Cannot delete SUPER_ADMIN" },
        { status: 400 }
      );
    }

    // Check if already deleted
    if (user.isDeleted) {
      return NextResponse.json(
        { error: "User is already deleted" },
        { status: 400 }
      );
    }

    // Soft delete user
    const deletedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deleteReason: reason || "No reason provided",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isDeleted: true,
        deletedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User ${deletedUser.name || deletedUser.email} has been deleted`,
      user: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
