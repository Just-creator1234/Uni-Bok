// app/actions/trackView.js
'use server';

import prisma from '@/lib/prisma';

export async function trackView(postId) {
  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        viewCount: { increment: 1 },
        trendingScore: { 
          increment: 1 + (0.5 * Math.exp(-0.1 * (Date.now() - (new Date().getTime())))) 
        },
        lastViewedAt: new Date()
      }
    });
    
    console.log("View tracked successfully for post:", postId);
    console.log("Updated view count:", updatedPost.viewCount);
    return updatedPost;
  } catch (error) {
    console.error("Error tracking view for post", postId, ":", error);
    throw error; // Re-throw the error if you want calling code to handle it
  }
}