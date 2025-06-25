import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  blockedPasswords: [
    "password",
    "12345678",
    "qwerty",
    "letmein",
    "admin123",
    "welcome",
  ],
};

export async function POST(req) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json(
      { error: "Missing token or password." },
      { status: 400 }
    );
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) {
    return NextResponse.json(
      { error: "Token is invalid or already used." },
      { status: 400 }
    );
  }

  // ⛔ Delete expired token
  if (resetToken.expires < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } });

    return NextResponse.json(
      { error: "Token has expired. Please request a new one." },
      { status: 400 }
    );
  }

  // ✅ Validate password strength
  const errors = [];
  const passwordLower = password.toLowerCase();

  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(`At least ${PASSWORD_RULES.minLength} characters`);
  }
  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("One uppercase letter");
  }
  if (PASSWORD_RULES.requireNumber && !/[0-9]/.test(password)) {
    errors.push("One number");
  }
  if (
    PASSWORD_RULES.requireSpecialChar &&
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    errors.push("One special character");
  }
  if (PASSWORD_RULES.blockedPasswords.includes(passwordLower)) {
    errors.push("Password is too common");
  }

  if (errors.length > 0) {
    return NextResponse.json(
      {
        error: `Password requirements: ${errors.join(", ")}`,
        code: "WEAK_PASSWORD",
      },
      { status: 400 }
    );
  }

  // ✅ Hash and update password
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  // ✅ Delete used token
  await prisma.passwordResetToken.delete({ where: { token } });

  return NextResponse.json({ success: true });
}
