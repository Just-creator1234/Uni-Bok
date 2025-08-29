// app/lib/actions/posts.js
"use server";

import prisma from "@/lib/prisma";

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "published", // 👈 only published posts
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    const mapped = posts.map((p) => ({
      id: p.id,
      category: p.category.toLowerCase(),
      title: p.title,
      excerpt: p.excerpt,
      author: p.author?.name || "Staff Writer",
      time: new Date(p.createdAt).toLocaleString(),
      image: p.imageUrl || "/placeholder.jpg",
      views: p.views || "0",
      readTime: `${Math.ceil((p.body?.length || 0) / 250)} min read`,
    }));

    return { success: true, data: mapped };
  } catch (err) {
    console.error("Posts fetch error:", err);
    return { success: false, error: "Failed to fetch posts" };
  }
}
