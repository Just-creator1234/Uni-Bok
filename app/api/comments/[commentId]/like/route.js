// app/api/comments/[commentId]/like/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import  prisma  from '@/lib/prisma';

export async function POST(request, { params }) {
  try {
    const { commentId } = await params;
    
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to like comments' },
        { status: 401 }
      );
    }

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // For now, we'll simply increment the like count
    // In a real application, you might want to track which users liked which comments
    // to prevent multiple likes from the same user
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    // Convert BigInt to String
    const commentWithStrings = {
      ...updatedComment,
      id: updatedComment.id.toString(),
      authorId: updatedComment.authorId.toString(),
      postId: updatedComment.postId.toString(),
      parentId: updatedComment.parentId ? updatedComment.parentId.toString() : null,
    };

    return NextResponse.json({
      success: true,
      likes: updatedComment.likes,
    });

  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { error: 'Failed to like comment' },
      { status: 500 }
    );
  }
}