
// /app/api/admin/users/[id]/purge/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(request, { params }) {
  try {
    // ✅ AWAIT params first
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    // SUPER_ADMIN only
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = id;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Prevent deleting SUPER_ADMIN
    if (user.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Cannot permanently delete SUPER_ADMIN" },
        { status: 400 }
      );
    }

    // PERMANENTLY delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: `User ${user.name || user.email} has been permanently deleted`,
    });

  } catch (error) {
    console.error("Error purging user:", error);
    
    // Handle foreign key constraints
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "Cannot delete user because they have related data. Please delete related data first or contact support." },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to permanently delete user" },
      { status: 500 }
    );
  }
}