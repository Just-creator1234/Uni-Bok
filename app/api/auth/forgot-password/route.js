import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/emailReset";
import crypto from "crypto";

export async function POST(req) {
  const { email } = await req.json();

  console.log(email);
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ success: true });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600 * 1000); 

  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expires },
  });

  await sendEmail(user.email, token);
  return NextResponse.json({ success: true });
}
