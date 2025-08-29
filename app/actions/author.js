// app/actions/author.js
'use server';

import  prisma  from '@/lib/prisma';
import { notFound } from 'next/navigation';

export async function getAuthorProfile(slug) {
  // 1. Author (User) + counts
  const author = await prisma.user.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { posts: { where: { published: true } } },
      },
      posts: {
        where: { published: true },
        include: {
          categories: { select: { name: true } },
          tags: { select: { name: true } },
        },
        orderBy: { publishDate: 'desc' },
      },
    },
  });

  if (!author) notFound();

  // 2. Basic stats (replace with real analytics later)
  const stats = {
    articles: author._count.posts,
    followers: 0,            // TODO: implement followers relation
    views: 0,                // TODO: implement views table
    likes: 0,                // TODO: implement likes table
  };

  // 3. Build article lists
  const articles = author.posts.map((p) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    category: p.categories[0]?.name ?? 'general',
    date: p.publishDate?.toISOString() ?? p.createdAt.toISOString(),
    readTime: `${Math.ceil(
      (p.subtitle?.length || p.title?.length || 500) / 1000
    )} min`,
    views: 0, // placeholder
    likes: 0, // placeholder
    image: p.coverImage,
  }));

  // 4. Pick "popular" = top 3 by views (or any rule)
  const popularArticles = articles.slice(0, 3);

  return {
    author: {
      id: author.id,
      name: author.name,
      role: 'Senior Technology Correspondent', // or store in DB
      bio: 'Journalist with over 15 years of experience covering technology breakthroughs, AI, and quantum computing.',
  joinDate: author.createdAt?.toISOString() ?? new Date().toISOString(),
      stats,
      social: {
        twitter: '@sarahjtech',
        linkedin: 'sarahjohnson-tech',
        email: author.email,
      },
    },
    articles,
    popularArticles,
  };
}