// app/actions/publishPost.js

"use server";

import prisma from "@/lib/prisma";

export async function publishPost(id) {
  if (!id) {
    throw new Error("No post ID provided");
  }

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    throw new Error("Post not found");
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      status: "PUBLISHED",
      published: true,
      publishedAt: new Date(),
    },
  });

  return updatedPost;
}
