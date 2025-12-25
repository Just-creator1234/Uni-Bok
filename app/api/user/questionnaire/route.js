// app/api/user/questionnaire/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { level, semester, indexNo, hasRegistered } = await request.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        level,
        semester,
        indexNo,
        hasCompletedQuestionnaire: true,
        hasRegistered: hasRegistered === "true" || hasRegistered === true,
      },
    });

    console.log(user, "immediately after questionnaire");

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Questionnaire error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
