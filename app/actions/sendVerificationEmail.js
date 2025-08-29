// app/actions/sendVerificationEmail.js
"use server";

import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email) {
  try {
    // 1. Find the row
    const sub = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });
    if (!sub) return { sent: false, error: "Not found" };

    // 2. Create (or refresh) token
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.newsletterSubscription.update({
      where: { email },
      data: { token },
    });

    // 3. Build verification link
    const link = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

    // 4. Send mail
    await transporter.sendMail({
      from: `"SpeedyNews" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Confirm your newsletter subscription",
      html: `
        <h2>Welcome to SpeedyNews!</h2>
        <p>Click the link below to confirm your subscription:</p>
        <a href="${link}">${link}</a>
        <p>If you didn’t request this, ignore this email.</p>
      `,
    });

    return { sent: true };
  } catch (err) {
    console.error(err);
    return { sent: false, error: "Send failed" };
  }
}
