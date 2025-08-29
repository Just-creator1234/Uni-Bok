"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { publishPost } from "@/app/actions/publishPost";
import { Send, Loader2, CheckCircle } from "lucide-react";

export default function PublishButton({ post }) {
  const [publishing, setPublishing] = useState(false);
  const [justPublished, setJustPublished] = useState(false);
  const router = useRouter();

  const handlePublishSinglePost = async () => {
    try {
      setPublishing(true);
      const data = await publishPost(post.id);

      // Show success state briefly
      setJustPublished(true);

      // Use a more user-friendly notification
      setTimeout(() => {
        router.push("/My-blogs");
      }, 1500);
    } catch (error) {
      console.error("Publish error:", error);

      // Better error handling with user-friendly message
      const errorMessage =
        error.message ||
        "An error occurred while publishing. Please try again.";
      alert(`Error: ${errorMessage}`);

      setPublishing(false);
    }
  };

  // Show success state
  if (justPublished) {
    return (
      <button
        disabled
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium shadow-sm transition-all duration-200"
      >
        <CheckCircle size={16} />
        Published!
      </button>
    );
  }

  return (
    <button
      onClick={handlePublishSinglePost}
      disabled={publishing}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium shadow-sm transition-all duration-200 disabled:cursor-not-allowed group"
    >
      {publishing ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Publishing...
        </>
      ) : (
        <>
          <Send
            size={16}
            className="group-hover:translate-x-0.5 transition-transform"
          />
          Publish Post
        </>
      )}
    </button>
  );
}
