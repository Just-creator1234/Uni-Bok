
"use server";

import prisma from "@/lib/prisma";

export async function deletePostById(postId) {
  try {
    // Fetch related tag and category IDs
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        tags: { select: { id: true } },
        categories: { select: { id: true } },
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const tagIds = post.tags.map((tag) => tag.id);

    // Delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    // Delete associated tags and categories
    await prisma.tag.deleteMany({
      where: { id: { in: tagIds } },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting post and related data:", error);
    return { success: false, message: error.message };
  }
}
