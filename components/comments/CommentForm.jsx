"use client";
import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";

const CommentForm = ({ postId, parentId = null, onCommentAdded, onCancel }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (status === "unauthenticated") {
      signIn();
      return;
    }

    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          postId,
          parentId,
        }),
      });

      if (response.ok) {
        setContent("");
        onCommentAdded?.(); // Notify parent that a comment was added
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert(error.message || "Error posting comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="bg-gray-50 p-4 rounded-sm mb-4">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="bg-gray-50 p-4 rounded-sm mb-4">
        <p className="text-gray-700 mb-2">Please sign in to leave a comment</p>
        <button
          onClick={() => signIn()}
          className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-gray-600">
            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={parentId ? "Write a reply..." : "Write a comment..."}
            className="w-full p-3 border border-gray-300 rounded-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Posting..."
            : parentId
            ? "Post Reply"
            : "Post Comment"}
        </button>
        {parentId && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;
