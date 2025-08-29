// app/actions/article.js
'use server';

import  prisma  from '@/lib/prisma';
import { notFound } from 'next/navigation';

export async function getArticlePage(slug) {
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      author: {
        select: { id: true, name: true, slug: true, email: true },
      },
      categories: true,
      tags: true,
    },
  });

  if (!post) notFound();

  let related = [];
  if (post.categories.length) {
    const categoryIds = post.categories.map((c) => c.id);
    related = await prisma.post.findMany({
      where: {
        id: { not: post.id },
        published: true,
        categories: { some: { id: { in: categoryIds } } },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        // readTime removed
        categories: { select: { name: true } },
      },
      take: 3,
      orderBy: { publishDate: 'desc' },
    });
  }

  return {
    post: {
      id: post.id,
      slug: post.slug,
      title: post.title,
      subtitle: post.subtitle,
      excerpt: post.excerpt,
      content: post.content?.html ?? post.content,
      coverImage: post.coverImage,
      altText: post.altText,
      publishedAt: post.publishDate?.toISOString() ?? post.createdAt.toISOString(),
      // readTime: computed below
      views: post.views ?? 0,
      likes: post.likes ?? 0,
      comments: post.comments ?? 0,
      category: post.categories[0]?.name ?? 'general',
      author: {
        id: post.author.id,
        name: post.author.name,
        slug: post.author.slug,
        email: post.author.email,
      },
      tags: post.tags,
    },
    relatedArticles: related.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      category: r.categories[0]?.name ?? 'general',
      readTime: `${Math.ceil(
        (r.content?.text?.length || r.excerpt?.length || 500) / 1000
      )} min read`,
      imageUrl: r.coverImage,
    })),
  };
}