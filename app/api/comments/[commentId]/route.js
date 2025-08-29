// app/api/comments/[commentId]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET a specific comment (optional - for single comment fetching)
export async function GET(request, { params }) {
  try {
    const { commentId } = await params;

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
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
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Convert BigInt to String if needed
    const commentWithStrings = {
      ...comment,
      id: comment.id.toString(),
      authorId: comment.authorId.toString(),
      postId: comment.postId.toString(),
      parentId: comment.parentId ? comment.parentId.toString() : null,
    };

    return NextResponse.json(commentWithStrings);
  } catch (error) {
    console.error("Error fetching comment:", error);
    return NextResponse.json(
      { error: "Failed to fetch comment" },
      { status: 500 }
    );
  }
}

// DELETE a comment
export async function DELETE(request, { params }) {
  try {
    const { commentId } = await params;

    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to delete comments" },
        { status: 401 }
      );
    }

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    });

    if (!existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check permissions: user must be owner or ADMIN
    const isOwner = session.user.id === existingComment.authorId;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "You can only delete your own comments" },
        { status: 403 }
      );
    }

    // Soft delete the comment
    const deletedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: session.user.id,
        deleteReason: !isOwner ? "Moderated by admin" : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
      deletedCommentId: deletedComment.id,
      deletedByAdmin: !isOwner,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);

    // Handle Prisma errors
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}

// PATCH (update) a comment
export async function PATCH(request, { params }) {
  try {
    const { commentId } = await params;

    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to edit comments" },
        { status: 401 }
      );
    }

    const { content } = await request.json();

    // Validate input
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Check if comment exists and user owns it
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    });

    if (!existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (existingComment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own comments" },
        { status: 403 }
      );
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
        isEdited: true,
        editedAt: new Date(),
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

    // Convert BigInt to String if needed
    const commentWithStrings = {
      ...updatedComment,
      id: updatedComment.id.toString(),
      authorId: updatedComment.authorId.toString(),
      postId: updatedComment.postId.toString(),
      parentId: updatedComment.parentId
        ? updatedComment.parentId.toString()
        : null,
    };

    return NextResponse.json(commentWithStrings);
  } catch (error) {
    console.error("Error updating comment:", error);

    // Handle Prisma errors
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}
