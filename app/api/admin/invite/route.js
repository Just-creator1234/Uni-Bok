// /app/api/admin/invite/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";
import { sendAdminInviteEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    // SUPER_ADMIN only
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();

    // Validate email
    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Check if user is already ADMIN or SUPER_ADMIN
    if (existingUser) {
      if (
        existingUser.role === "ADMIN" ||
        existingUser.role === "SUPER_ADMIN"
      ) {
        return NextResponse.json(
          { error: "User is already an admin" },
          { status: 400 }
        );
      }
    }

    // Check for existing invite
    const existingInvite = await prisma.adminInvite.findUnique({
      where: { email: normalizedEmail },
    });

    // Check if there's a pending invite
    if (existingInvite && !existingInvite.used) {
      const isExpired = new Date(existingInvite.expires) < new Date();

      if (!isExpired) {
        return NextResponse.json(
          { error: "User already has a pending invite" },
          { status: 400 }
        );
      }
    }

    // Generate token and expiry (24 hours)
    const token = uuidv4();
    const expires = addHours(new Date(), 24);

    let invite; // DECLARE invite HERE so it's available in the whole function

    // Check if user exists first
    if (existingUser) {
      // User exists - upsert the invite
      invite = await prisma.adminInvite.upsert({
        where: { email: normalizedEmail },
        update: {
          token,
          expires,
          used: false,
          usedAt: null,
          invitedBy: session.user.id,
        },
        create: {
          email: normalizedEmail,
          token,
          expires,
          invitedBy: session.user.id,
          role: "ADMIN",
        },
      });

      // If user is a STUDENT, update their role immediately
      if (existingUser.role === "STUDENT") {
        await prisma.user.update({
          where: { email: normalizedEmail },
          data: { role: "ADMIN" },
        });
      }
    } else {
      // User doesn't exist yet
      // First, delete any existing invite (cleanup)
      if (existingInvite) {
        await prisma.adminInvite.delete({
          where: { id: existingInvite.id },
        });
      }

      // Create new invite
      invite = await prisma.adminInvite.create({
        data: {
          email: normalizedEmail,
          token,
          expires,
          invitedBy: session.user.id,
          role: "ADMIN",
        },
      });
    }

    // Send email
    try {
      await sendAdminInviteEmail(normalizedEmail, token);
    } catch (emailError) {
      console.error("Failed to send invite email:", emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      message: `Invite sent to ${normalizedEmail}`,
      invite: {
        id: invite.id,
        email: invite.email,
        expires: invite.expires,
      },
    });
  } catch (error) {
    console.error("Error sending invite:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send invite" },
      { status: 500 }
    );
  }
}
