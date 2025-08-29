"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust to your auth file
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";
import nodemailer from "nodemailer";
/* ---------- small helpers ---------- */
function slugify(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function uniqueSlug(base) {
  let slug = slugify(base);
  if (!slug) slug = "user";
  let candidate = slug;
  let counter = 0;

  while (true) {
    const exists = await prisma.user.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;

    const suffix = Math.random().toString(36).substring(2, 6);
    candidate = `${slug}-${suffix}`;
    counter++;
    if (counter > 10) throw new Error("Could not create unique slug");
  }
}

export async function sendChangeEmailVerification(newEmail) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  // 1. Basic checks
  const existing = await prisma.user.findUnique({
    where: { email: newEmail },
    select: { id: true },
  });
  if (existing && existing.id !== session.user.id) {
    return { error: "E-mail already taken" };
  }

  // 2. Create token (same table NextAuth uses)
  const token = uuidv4();
  await prisma.verificationToken.create({
    data: {
      identifier: newEmail,
      token,
      expires: addHours(new Date(), 24), // 24h TTL
    },
  });

  // 3. Send mail
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const url = `${process.env.NEXTAUTH_URL}/verify-email-change?token=${token}`;
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: newEmail,
    subject: "Confirm your new e-mail address",
    html: `<p>Click the link to confirm:</p><a href="${url}">${url}</a>`,
  });

  return { success: true };
}
/* ---------- server actions ---------- */
export async function updateUserProfile(formData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name")?.trim();

  if (!name) {
    return { error: "Put in the new name" };
  }

  // Build slug from name
  const slug = await uniqueSlug(name);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, slug },
  });

  revalidatePath(`/Account`);
  return { success: true };
}

export async function changePassword(formData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required" };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match" };
  }
  if (newPassword.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });
  if (!user?.password) {
    return { error: "User not found or uses OAuth provider" };
  }

  const isCorrect = await bcrypt.compare(currentPassword, user.password);
  if (!isCorrect) {
    return { error: "Current password is incorrect" };
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  });

  return { success: true };
}

export async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, slug: true },
  });
}

// export async function deleteAccount() {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) {
//     return { error: "Unauthorized" };
//   }

//   // (optional) extra sanity check – require fresh row exists
//   const user = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: { id: true },
//   });
//   if (!user) return { error: "User not found" };

//   await prisma.user.delete({ where: { id: user.id } });
//   return { success: true };
// }

export async function deleteAccount() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // (optional) extra sanity check – require fresh row exists
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });
  if (!user) return { error: "User not found" };

  // Find the user's profile by the user's ID
  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  if (profile) {
    // Delete the user's profile
    await prisma.userProfile.delete({
      where: { id: profile.id },
    });
  }

  return { success: true };
}
