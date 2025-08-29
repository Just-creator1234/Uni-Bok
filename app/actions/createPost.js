"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import slugify from "slugify";

async function createUniqueSlug(base) {
  let slug = slugify(base, { lower: true, strict: true });
  let counter = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${slug}-${counter++}`;
  }
  return slug;
}

export async function createPost(formData) {
  const session = await getServerSession(authOptions);

  console.log(session.user.id, "gggggggggggg");
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const data = Object.fromEntries(formData.entries());
  const uniqueSlug = await createUniqueSlug(data.title);

  // --- basic fields ---
  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: uniqueSlug,
      content: data.content,
      excerpt: data.excerpt,
      status: data.status,
      breaking: data.breaking === "true",
      published: data.status === "PUBLISHED",
      publishDate: data.publishDate ? new Date(data.publishDate) : null,

      coverImage: data.coverImage || null,
      altText: data.altText || null,

      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      focusKeyword: data.focusKeyword || null,
      ogTitle: data.ogTitle || null,
      ogDescription: data.ogDescription || null,
      ogImage: data.ogImage || null,
      twitterCard: data.twitterCard || "summary_large_image",

      subtitle: data.subtitle || null,
    
      language: data.language || "en",
      series: data.series || null,
      seriesOrder: Number(data.seriesOrder) || 1,
      
   
      allowComments: data.allowComments !== "false",
      allowSharing: data.allowSharing !== "false",
      featured: data.featured === "true",
      sticky: data.sticky === "true",
      coAuthors: data.coAuthors ? JSON.parse(data.coAuthors) : [],
      editorNotes: data.editorNotes || null,
      targetKeywords: data.targetKeywords
        ? JSON.parse(data.targetKeywords)
        : [],
      customFields: data.customFields ? JSON.parse(data.customFields) : {},
      videoUrl: data.videoUrl || null,
      audioUrl: data.audioUrl || null,

      authorId: session.user.id,
    },
  });

  // --- connect fixed categories ---
  const categoryIds = JSON.parse(data.categories || "[]");
  for (const id of categoryIds) {
    await prisma.post.update({
      where: { id: post.id },
      data: { categories: { connect: { id } } },
    });
  }

  // --- connect / create tags ---
  const tagNames = JSON.parse(data.tags || "[]");
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
    });
    await prisma.post.update({
      where: { id: post.id },
      data: { tags: { connect: { id: tag.id } } },
    });
  }

  revalidatePath("/Blogs");
  return { success: true, message: "Post created!", post };
}
