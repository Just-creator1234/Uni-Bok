import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token is missing." }, { status: 400 });
    }

    const existingToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 400 }
      );
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      // 🧹 Clean up both token and unverified user
      const user = await prisma.user.findUnique({
        where: { email: existingToken.identifier },
      });

      if (user && !user.emailVerified) {
        await prisma.user.delete({ where: { email: existingToken.identifier } });
      }

      await prisma.verificationToken.delete({ where: { token } });

      return NextResponse.json(
        { error: "Token has expired and unverified user has been removed." },
        { status: 400 }
      );
    }

    // ✅ Mark user as verified
    await prisma.user.update({
      where: { email: existingToken.identifier },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ success: true, message: "Email verified." });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
