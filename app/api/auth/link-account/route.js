// app/api/auth/link-account/route.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { googleEmail } = await request.json();

    // Check if Google account is already linked to another user
    const existingGoogleAccount = await prisma.account.findFirst({
      where: {
        provider: "google",
        providerAccountId: googleEmail,
        NOT: { userId: session.user.id }
      }
    });

    if (existingGoogleAccount) {
      return NextResponse.json({ error: "Google account already linked to another user" }, { status: 400 });
    }

    // Link Google account to current user
    await prisma.account.create({
      data: {
        userId: session.user.id,
        type: "oauth",
        provider: "google",
        providerAccountId: googleEmail,
        access_token: "linked-manually",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: "Bearer",
        scope: "email profile",
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Linking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}