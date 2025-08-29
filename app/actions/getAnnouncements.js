// app/actions/getAnnouncements.js
"use server";

import prisma from "@/lib/prisma";

export async function getAnnouncementPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        status: "PUBLISHED", // Added status filter
        OR: [
          // Use OR to include posts with publishedAt <= now OR publishedAt is null
          {
            publishedAt: {
              lte: new Date(),
            },
          },
          {
            publishedAt: null,
          },
        ],
        categories: {
          some: {
            slug: "announcement",
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        publishedAt: {
          sort: "desc",
          nulls: "last", // Handle null values in sorting
        },
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching announcement posts:", error);
    throw new Error("Failed to fetch announcement posts");
  }
}
