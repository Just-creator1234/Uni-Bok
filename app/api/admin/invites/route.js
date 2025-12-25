// /app/api/admin/invites/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    // SUPER_ADMIN only
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all"; // all, pending, used, expired

    let whereClause = {};

    switch (status) {
      case "pending":
        whereClause = {
          used: false,
          expires: { gt: new Date() },
        };
        break;
      case "used":
        whereClause = { used: true };
        break;
      case "expired":
        whereClause = {
          used: false,
          expires: { lt: new Date() },
        };
        break;
      // "all" includes everything
    }

    const invites = await prisma.adminInvite.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        invitedByUser: {
          // Changed from 'user' to 'invitedByUser'
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json({
      success: true,
      invites,
    });
  } catch (error) {
    console.error("Error fetching invites:", error);
    return NextResponse.json(
      { error: "Failed to fetch invites" },
      { status: 500 }
    );
  }
}
