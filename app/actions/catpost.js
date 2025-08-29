"use server";

import prisma from "@/lib/prisma";

/* --------------------------------------------------
   1️⃣  Get posts for one category (or all) with sorting options
-------------------------------------------------- */
export async function getPostsByCategory(
  slug,
  sortBy = "latest",
  limit = null
) {
  try {
    const where = {
      published: true,
      status: "PUBLISHED",
      OR: [{ publishDate: { lte: new Date() } }, { publishDate: null }],
    };

    if (slug && slug !== "all") {
      where.categories = { some: { slug } };
    }

    let orderBy = [{ sticky: "desc" }];

    if (sortBy === "latest") {
      orderBy.push({ publishDate: "desc" });
    } else if (sortBy === "popular") {
      orderBy.push({ viewCount: "desc" });
    } else if (sortBy === "trending") {
      orderBy.push({ trendingScore: "desc" });
    }

    const posts = await prisma.post.findMany({
      where,
      ...(limit && { take: limit }),
      orderBy,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        coverImage: true,
        publishDate: true,
        createdAt: true,
        breaking: true,
        featured: true,
        videoUrl: true,
        viewCount: true,
        trendingScore: true,
        lastViewedAt: true,
        metaTitle: true,
        metaDescription: true,
        categories: { select: { slug: true, name: true } },
        author: { select: { id: true, name: true } },
        tags: { select: { name: true } },
      },
    });

    return posts.map((post) => {
      const wordCount = countWordsFromContent(post.content);
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || generateExcerpt(post.content, 150),
        category: post.categories[0]?.slug || "all",
        categoryName: post.categories[0]?.name || "General",
        author: { name: post.author.name || "Anonymous" },
        date: post.publishDate?.toISOString() || post.createdAt.toISOString(),
        views: post.viewCount || 0,
        readTime: calculateReadTime(wordCount),
        image: post.coverImage || "/default-article.jpg",
        videoUrl: post.videoUrl || null,
        isBreaking: post.breaking || false,
        isFeatured: post.featured || false,
        trendingScore: post.trendingScore || 0,
        lastViewed: post.lastViewedAt?.toISOString() || null,
        tags: post.tags.map((t) => t.name),
        ...(post.metaTitle && { metaTitle: post.metaTitle }),
        ...(post.metaDescription && { metaDescription: post.metaDescription }),
      };
    });
  } catch (err) {
    console.error("getPostsByCategory error:", err);
    throw new Error("Failed to fetch posts");
  }
}

/* --------------------------------------------------
   2️⃣  Get popular posts within a category
-------------------------------------------------- */
export async function getPopularPostsByCategory(slug, limit = 5) {
  try {
    const where = {
      published: true,
      status: "PUBLISHED",
      lastViewedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
    };

    if (slug && slug !== "all") {
      where.categories = { some: { slug } };
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: [
        { trendingScore: "desc" }, // Weighted score
        { viewCount: "desc" }, // Fallback to total views
      ],
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        publishDate: true,
        viewCount: true,
        trendingScore: true,
        categories: { select: { slug: true, name: true } },
        author: { select: { name: true } },
      },
    });

    return posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.categories[0]?.slug || "all",
      categoryName: post.categories[0]?.name || "General",
      author: { name: post.author.name || "Anonymous" },
      date: post.publishDate?.toISOString(),
      views: post.viewCount || 0,
      trendingScore: post.trendingScore || 0,
      image: post.coverImage || "/default-article.jpg",
    }));
  } catch (err) {
    console.error("getPopularPostsByCategory error:", err);
    return [];
  }
}

/* --------------------------------------------------
   3️⃣  Get trending posts within a category
-------------------------------------------------- */
export async function getTrendingPostsByCategory(slug, limit = 5) {
  try {
    const where = {
      published: true,
      status: "PUBLISHED",
      trendingScore: { gt: 0 }, // Only posts with some trending activity
      lastViewedAt: { gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }, // Last 3 days
    };

    if (slug && slug !== "all") {
      where.categories = { some: { slug } };
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: [{ trendingScore: "desc" }, { viewCount: "desc" }],
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        publishDate: true,
        viewCount: true,
        trendingScore: true,
        categories: { select: { slug: true, name: true } },
        author: { select: { name: true } },
      },
    });

    return posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.categories[0]?.slug || "all",
      categoryName: post.categories[0]?.name || "General",
      author: { name: post.author.name || "Anonymous" },
      date: post.publishDate?.toISOString(),
      views: post.viewCount || 0,
      trendingScore: post.trendingScore || 0,
      image: post.coverImage || "/default-article.jpg",
    }));
  } catch (err) {
    console.error("getTrendingPostsByCategory error:", err);
    return [];
  }
}

/* --------------------------------------------------
   4️⃣  Get all categories (without breaking)
-------------------------------------------------- */
export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        _count: { select: { posts: true } },
      },
      orderBy: { name: "asc" },
    });

    return categories.map((c) => ({
      id: c.slug,
      name: c.name,
      slug: c.slug,
      color: getCategoryColor(c.slug),
      count: c._count.posts,
    }));
  } catch (err) {
    console.error("getAllCategories error:", err);
    throw new Error("Failed to fetch categories");
  }
}

/* --------------------------------------------------
   Helpers (unchanged)
-------------------------------------------------- */
function countWordsFromContent(content) {
  if (!content) return 0;
  if (typeof content === "string") return content.split(/\s+/).length;
  if (typeof content === "object" && content.type === "doc")
    return countWordsFromProseMirror(content);
  return JSON.stringify(content).split(/\s+/).length;
}

function countWordsFromProseMirror(doc) {
  let words = 0;
  const walk = (node) => {
    if (node.text) words += node.text.split(/\s+/).length;
    if (node.content) node.content.forEach(walk);
  };
  if (doc.content) doc.content.forEach(walk);
  return words;
}

function generateExcerpt(content, len = 150) {
  if (!content) return "";
  const text = typeof content === "string" ? content : JSON.stringify(content);
  return text.slice(0, len) + (text.length > len ? "…" : "");
}

function calculateReadTime(wordCount) {
  const min = Math.ceil(wordCount / 200);
  return min <= 1 ? "1 min" : `${min} mins`;
}

function getCategoryColor(slug) {
  const map = {
    breaking: "red",
    politics: "blue",
    tech: "purple",
    sports: "green",
    business: "yellow",
    world: "gray",
    health: "pink",
    science: "cyan",
    entertainment: "indigo",
    default: "gray",
  };
  return map[slug] || map.default;
}
