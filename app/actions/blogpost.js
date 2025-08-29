// app/actions/getPosts.ts
"use server";

import prisma from "@/lib/prisma";

export async function getPosts(status) {
  const posts = await prisma.post.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
    include: {
      categories: true,
      tags: true,
      author: true,
    },
  });

  return posts;
}
