// app/api/comments/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to comment" },
        { status: 401 }
      );
    }

    const { content, postId, parentId } = await request.json();

    // Validate input
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Verify the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If this is a reply, verify the parent comment exists and belongs to the same post
    if (parentId) {
      const parentComment = await prisma.comment.findFirst({
        where: {
          id: parentId,
          postId: postId,
          isDeleted: false,
        },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
    }

    // Create the comment
    const newComment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: postId,
        authorId: session.user.id,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Convert BigInt to String
    const commentWithStrings = {
      ...newComment,
      id: newComment.id.toString(),
      authorId: newComment.authorId.toString(),
      postId: newComment.postId.toString(),
      parentId: newComment.parentId ? newComment.parentId.toString() : null,
    };

    return NextResponse.json(commentWithStrings, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
