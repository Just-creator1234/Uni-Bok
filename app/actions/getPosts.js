// "use server";

// import prisma from "@/lib/prisma";

// export async function getAllPublishedPosts() {
//   try {
//     const posts = await prisma.post.findMany({
//       where: {
//         status: "PUBLISHED",
//       },
//       orderBy: [
//         {
//           breaking: "desc",
//         },
//         {
//           createdAt: "desc",
//         },
//       ],
//       include: {
//         categories: true,
//         tags: true,
//         author: true,
//       },
//     });

//     return posts;
//   } catch (error) {
//     console.error("Error fetching published posts:", error);
//     throw new Error("Failed to fetch posts");
//   }
// }

// export async function getTrendingPosts(limit = 5) {
//   try {
//     return await prisma.post.findMany({
//       where: {
//         published: true,
//         lastViewedAt: {
//           gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
//         },
//       },
//       orderBy: [{ trendingScore: "desc" }, { viewCount: "desc" }],
//       take: limit,
//       select: {
//         id: true,
//         title: true,
//         slug: true,
//         viewCount: true,
//         coverImage: true,
//         createdAt: true,
//         categories: true,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching trending posts:", error);
//     return [];
//   }
// }

// export async function getPopularPosts(limit = 5) {
//   return await prisma.post.findMany({
//     where: {
//       published: true,
//       // Only consider posts viewed in the last 7 days
//       lastViewedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
//     },
//     orderBy: [
//       { trendingScore: "desc" }, // Weighted score (see below)
//       { viewCount: "desc" }, // Fallback to total views
//     ],
//     take: limit,
//     include: { author: true, categories: true },
//   });
// }

"use server";

import prisma from "@/lib/prisma";

const POSTS_PER_PAGE = 10;

export async function getAllPublishedPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: [
        {
          breaking: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: POSTS_PER_PAGE,
      include: {
        categories: true,
        tags: true,
        author: true,
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching published posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function getMorePosts({ page = 1, category = null }) {
  try {
    const where = {
      status: "PUBLISHED",
      ...(category && {
        categories: {
          some: {
            OR: [
              { slug: category },
              { name: { equals: category, mode: "insensitive" } },
            ],
          },
        },
      }),
    };

    const posts = await prisma.post.findMany({
      where,
      orderBy: [
        {
          breaking: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
      include: {
        categories: true,
        tags: true,
        author: true,
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching more posts:", error);
    return [];
  }
}

export async function getTrendingPosts(limit = 5) {
  try {
    return await prisma.post.findMany({
      where: {
        published: true,
        lastViewedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      orderBy: [{ trendingScore: "desc" }, { viewCount: "desc" }],
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        coverImage: true,
        createdAt: true,
        categories: true,
      },
    });
  } catch (error) {
    console.error("Error fetching trending posts:", error);
    return [];
  }
}

export async function getPopularPosts(limit = 5) {
  return await prisma.post.findMany({
    where: {
      published: true,
      // Only consider posts viewed in the last 7 days
      lastViewedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
    orderBy: [
      { trendingScore: "desc" }, // Weighted score (see below)
      { viewCount: "desc" }, // Fallback to total views
    ],
    take: limit,
    include: { author: true, categories: true },
  });
}
