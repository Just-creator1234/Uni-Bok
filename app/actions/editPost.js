// app/actions/editPost.js
"use server";

import prisma from "@/lib/prisma";

export async function getPostBySlug(slug) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      categories: { select: { id: true, slug: true, name: true } },
      tags: { select: { id: true, name: true } },
    },
  });
  return post; // returns full record or null
}

export async function updatePost(slug, data) {
  // data is a plain object from the client
  const {
    title,
    excerpt,
    content,
    coverImage,
    altText,
    categories, // array of category slugs
    tags, // array of tag names
    status,
    metaTitle,
    metaDescription,
    focusKeyword,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    canonicalUrl,
    publishDate,
  } = data;

  console.log(status, "status");
  // upsert categories / tags by slug / name
  const categoryConnect = categories?.length
    ? await prisma.category.findMany({ where: { slug: { in: categories } } })
    : [];
  const tagConnect = tags?.length
    ? await prisma.tag.findMany({ where: { name: { in: tags } } })
    : [];

  await prisma.post.update({
    where: { slug },
    data: {
      title,
      excerpt,
      content,
      coverImage,
      altText,
      status,
      publishDate: status === "SCHEDULED" ? new Date(publishDate) : undefined,
      metaTitle,
      metaDescription,
      focusKeyword,
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard,
      canonicalUrl,
      categories: { set: categoryConnect.map((c) => ({ id: c.id })) },
      tags: { set: tagConnect.map((t) => ({ id: t.id })) },
    },
  });

  return { message: "Post updated" };
}
