// "use client";
// import React, { useState } from "react";
// import { useSession, signIn } from "next-auth/react";

// const CommentForm = ({ postId, parentId = null, onCommentAdded, onCancel }) => {
//   const [content, setContent] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { data: session, status } = useSession();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if user is authenticated
//     if (status === "unauthenticated") {
//       signIn();
//       return;
//     }

//     if (!content.trim()) return;

//     setIsSubmitting(true);

//     try {
//       const response = await fetch("/api/comments", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           content,
//           postId,
//           parentId,
//         }),
//       });

//       if (response.ok) {
//         setContent("");
//         onCommentAdded?.(); // Notify parent that a comment was added
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to post comment");
//       }
//     } catch (error) {
//       console.error("Error posting comment:", error);
//       alert(error.message || "Error posting comment. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (status === "loading") {
//     return (
//       <div className="bg-gray-50 p-4 rounded-sm mb-4">
//         <p className="text-gray-500">Loading...</p>
//       </div>
//     );
//   }

//   if (status === "unauthenticated") {
//     return (
//       <div className="bg-gray-50 p-4 rounded-sm mb-4">
//         <p className="text-gray-700 mb-2">Please sign in to leave a comment</p>
//         <button
//           onClick={() => signIn()}
//           className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700"
//         >
//           Sign In
//         </button>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="mb-4">
//       <div className="flex items-start gap-3 mb-3">
//         <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
//           <span className="text-sm font-medium text-gray-600">
//             {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
//           </span>
//         </div>
//         <div className="flex-1">
//           <textarea
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder={parentId ? "Write a reply..." : "Write a comment..."}
//             className="w-full p-3 border border-gray-300 rounded-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             rows={3}
//             disabled={isSubmitting}
//           />
//         </div>
//       </div>
//       <div className="flex gap-2">
//         <button
//           type="submit"
//           disabled={isSubmitting || !content.trim()}
//           className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isSubmitting
//             ? "Posting..."
//             : parentId
//             ? "Post Reply"
//             : "Post Comment"}
//         </button>
//         {parentId && (
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 border border-gray-300 text-gray-600 rounded-sm hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//         )}
//       </div>
//     </form>
//   );
// };

// export default CommentForm;

"use client";
import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Send, MessageSquare, User, LogIn, Loader2 } from "lucide-react";

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
      <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-center gap-3 py-4">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-blue-600 font-semibold">Loading comment form...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 mb-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Join the Conversation
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Sign in to share your thoughts and engage with the community
          </p>
          <button
            onClick={() => signIn()}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center gap-3 mx-auto"
          >
            <LogIn className="h-5 w-5" />
            Sign In to Comment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 mb-6 hover:border-blue-200 transition-colors">
      {/* Form Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md">
          <span className="text-white font-bold">
            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>
        <div>
          <h4 className="font-bold text-gray-800">
            {session?.user?.name || "Anonymous User"}
          </h4>
          <p className="text-sm text-gray-500">
            {parentId ? "Writing a reply..." : "Share your thoughts"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Textarea Container */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              parentId
                ? "What would you like to say in response?"
                : "What are your thoughts on this post?"
            }
            className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-500 focus:ring-0 transition-colors text-gray-800 placeholder-gray-400"
            rows={parentId ? 3 : 4}
            disabled={isSubmitting}
            maxLength={1000}
          />

          {/* Character Counter */}
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {content.length}/1000
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MessageSquare className="h-4 w-4" />
            <span>
              {parentId ? "Replying to comment" : "Adding a new comment"}
            </span>
          </div>

          <div className="flex gap-3">
            {parentId && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center gap-2 min-w-[140px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {parentId ? "Post Reply" : "Post Comment"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Tips Section (for new comments only) */}
      {!parentId && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="bg-blue-50 rounded-xl p-4">
            <h5 className="font-semibold text-blue-800 text-sm mb-2">
              💡 Comment Guidelines
            </h5>
            <ul className="text-blue-700 text-xs space-y-1">
              <li>• Be respectful and constructive</li>
              <li>• Stay on topic and add value to the discussion</li>
              <li>• Use clear and concise language</li>
              <li>
                • Especially you, "Dakrobat" (Darlington—and I will not remove
                this, so don’t bother asking!).
              </li>
              <li>• Also reload the page if a reply is not comming</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentForm;
