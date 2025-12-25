// app/api/user/courses/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's level and semester
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { level: true, semester: true },
    });

    // If user hasn't set level/semester, return empty array
    if (!user.level || !user.semester) {
      return NextResponse.json([]);
    }

    const courses = await prisma.course.findMany({
      where: {
        level: user.level,
        semester: user.semester,
      },
      include: {
        topics: {
          include: {
            contents: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { code: "asc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Courses fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}