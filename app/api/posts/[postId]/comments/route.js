// app/api/posts/[postId]/comments/route.js
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// Helper function to build nested comment tree
function buildCommentTree(comments) {
  const commentMap = {};
  const rootComments = [];

  // First pass: create a map of all comments
  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  // Second pass: build the tree structure
  comments.forEach((comment) => {
    if (comment.parentId) {
      // This is a reply, add it to its parent's replies array
      if (commentMap[comment.parentId]) {
        commentMap[comment.parentId].replies.push(commentMap[comment.id]);
      }
    } else {
      // This is a top-level comment
      rootComments.push(commentMap[comment.id]);
    }
  });

  // Sort replies by date
  Object.values(commentMap).forEach((comment) => {
    comment.replies.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  });

  return rootComments.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
}

export async function GET(request, { params }) {
  try {
    const { postId } = await params;

    // Fetch all comments for this post (flat array)
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
        isDeleted: false,
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
      orderBy: {
        createdAt: "asc",
      },
    });

    // Convert BigInt to String for JSON serialization
    const commentsWithStrings = comments.map((comment) => ({
      ...comment,
      id: comment.id.toString(),
      authorId: comment.authorId.toString(),
      postId: comment.postId.toString(),
      parentId: comment.parentId ? comment.parentId.toString() : null,
      replies: [], // Initialize empty replies array
    }));

    // Build the nested comment tree
    const nestedComments = buildCommentTree(commentsWithStrings);

    return NextResponse.json(nestedComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
