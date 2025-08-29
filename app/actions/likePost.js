"use server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import crypto from "crypto";

async function getVisitorId() {
  const cookieStore = await cookies();
  const stored = cookieStore.get("vid")?.value;
  const vid = stored ?? crypto.randomBytes(16).toString("hex");
  if (!stored) {
    cookieStore.set("vid", vid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return crypto.createHash("sha256").update(vid).digest("hex");
}
// app/actions/likePost.js
export async function likePost(slug) {
  try {
    const visitorId = await getVisitorId();

    const existing = await prisma.postLike.findUnique({
      where: { postSlug_visitorId: { postSlug: slug, visitorId } },
    });

    if (existing) {
      await prisma.postLike.delete({ where: { id: existing.id } });
    } else {
      await prisma.postLike.create({ data: { postSlug: slug, visitorId } });
    }

    const totalAfter = await prisma.postLike.count({
      where: { postSlug: slug },
    });
    return { success: true, total: totalAfter, isLiked: !existing };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Server error" };
  }
}
