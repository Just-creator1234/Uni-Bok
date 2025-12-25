// app/api/announcements/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        status: "PUBLISHED",
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
        comments: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        publishedAt: {
          sort: "desc",
          nulls: "last",
        },
      },
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}