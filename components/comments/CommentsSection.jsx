"use client";
import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const countComments = (commentsArray) => {
    let count = 0;
    const countRecursive = (comments) => {
      comments.forEach((comment) => {
        count++;
        if (comment.replies && comment.replies.length > 0) {
          countRecursive(comment.replies);
        }
      });
    };
    countRecursive(commentsArray);
    return count;
  };

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/posts/${postId}/comments`);

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setComments(data);
      setCommentCount(countComments(data));
    } catch (err) {
      setError(err.message);
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentAdded = () => {
    fetchComments();
    setIsMinimized(false);
  };

  const handleCommentLike = (commentId, newLikeCount) => {
    const updateCommentLikes = (comments) => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, likes: newLikeCount };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: updateCommentLikes(comment.replies) };
        }
        return comment;
      });
    };

    setComments((prevComments) => updateCommentLikes(prevComments));
  };

  // Function to handle comment updates
  const handleCommentUpdate = (updatedComment) => {
    const updateCommentInTree = (comments) => {
      return comments.map((comment) => {
        if (comment.id === updatedComment.id) {
          return updatedComment;
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: updateCommentInTree(comment.replies) };
        }
        return comment;
      });
    };

    setComments((prevComments) => updateCommentInTree(prevComments));
  };

  // NEW: Function to handle comment deletion
  const handleCommentDelete = (deletedCommentId, deletedByAdmin) => {
    const removeCommentFromTree = (comments) => {
      return comments.filter((comment) => {
        if (comment.id === deletedCommentId) {
          return false; // Remove this comment
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: removeCommentFromTree(comment.replies),
          };
        }
        return comment;
      });
    };

    setComments((prevComments) => removeCommentFromTree(prevComments));

    // Show success message (you can replace with toast notifications)
    if (deletedByAdmin) {
      console.log("Comment moderated successfully");
    } else {
      console.log("Comment deleted successfully");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  if (error) {
    return (
      <div className="border-t border-gray-200 pt-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
        <div className="bg-red-50 border border-red-200 p-4 rounded-sm">
          <p className="text-red-700">Error loading comments: {error}</p>
          <button
            onClick={fetchComments}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded-sm hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-8 mt-8">
      {/* Header with Minimize Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          Comments {commentCount > 0 && `(${commentCount})`}
        </h2>

        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          title={isMinimized ? "Expand comments" : "Minimize comments"}
        >
          {isMinimized ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronUp className="h-5 w-5" />
          )}
        </button>
      </div>

      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />

      {isMinimized && commentCount > 0 && (
        <div className="bg-gray-50 p-4 rounded-sm mb-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {commentCount} comment{commentCount !== 1 ? "s" : ""} hidden
            </p>
            <button
              onClick={() => setIsMinimized(false)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Show comments
            </button>
          </div>
        </div>
      )}

      {!isMinimized && (
        <>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading comments...</p>
            </div>
          ) : (
            <CommentList
              comments={comments}
              postId={postId}
              onCommentLike={handleCommentLike}
              onCommentUpdate={handleCommentUpdate}
              onCommentDelete={handleCommentDelete} // Pass the delete handler
            />
          )}
        </>
      )}
    </div>
  );
};

export default CommentsSection;
