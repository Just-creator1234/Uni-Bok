// app/api/auth/check-questionnaire/route.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ completed: true }); // If no session, assume completed
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { hasCompletedQuestionnaire: true },
    });

    return NextResponse.json({
      completed: user?.hasCompletedQuestionnaire || false,
    });
  } catch (error) {
    console.error("Questionnaire check error:", error);
    return NextResponse.json({ completed: true }, { status: 500 }); // Fallback to completed
  }
}
