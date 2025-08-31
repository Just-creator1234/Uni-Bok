// "use client";
// import React, { useState, useEffect } from "react";
// import CommentForm from "./CommentForm";
// import CommentList from "./CommentList";
// import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

// const CommentsSection = ({ postId }) => {
//   const [comments, setComments] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [commentCount, setCommentCount] = useState(0);

//   const countComments = (commentsArray) => {
//     let count = 0;
//     const countRecursive = (comments) => {
//       comments.forEach((comment) => {
//         count++;
//         if (comment.replies && comment.replies.length > 0) {
//           countRecursive(comment.replies);
//         }
//       });
//     };
//     countRecursive(commentsArray);
//     return count;
//   };

//   const fetchComments = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await fetch(`/api/posts/${postId}/comments`);

//       if (!response.ok) {
//         throw new Error("Failed to fetch comments");
//       }

//       const data = await response.json();
//       setComments(data);
//       setCommentCount(countComments(data));
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching comments:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCommentAdded = () => {
//     fetchComments();
//     setIsMinimized(false);
//   };

//   const handleCommentLike = (commentId, newLikeCount) => {
//     const updateCommentLikes = (comments) => {
//       return comments.map((comment) => {
//         if (comment.id === commentId) {
//           return { ...comment, likes: newLikeCount };
//         }
//         if (comment.replies && comment.replies.length > 0) {
//           return { ...comment, replies: updateCommentLikes(comment.replies) };
//         }
//         return comment;
//       });
//     };

//     setComments((prevComments) => updateCommentLikes(prevComments));
//   };

//   // Function to handle comment updates
//   const handleCommentUpdate = (updatedComment) => {
//     const updateCommentInTree = (comments) => {
//       return comments.map((comment) => {
//         if (comment.id === updatedComment.id) {
//           return updatedComment;
//         }
//         if (comment.replies && comment.replies.length > 0) {
//           return { ...comment, replies: updateCommentInTree(comment.replies) };
//         }
//         return comment;
//       });
//     };

//     setComments((prevComments) => updateCommentInTree(prevComments));
//   };

//   // NEW: Function to handle comment deletion
//   const handleCommentDelete = (deletedCommentId, deletedByAdmin) => {
//     const removeCommentFromTree = (comments) => {
//       return comments.filter((comment) => {
//         if (comment.id === deletedCommentId) {
//           return false; // Remove this comment
//         }
//         if (comment.replies && comment.replies.length > 0) {
//           return {
//             ...comment,
//             replies: removeCommentFromTree(comment.replies),
//           };
//         }
//         return comment;
//       });
//     };

//     setComments((prevComments) => removeCommentFromTree(prevComments));

//     // Show success message (you can replace with toast notifications)
//     if (deletedByAdmin) {
//       console.log("Comment moderated successfully");
//     } else {
//       console.log("Comment deleted successfully");
//     }
//   };

//   useEffect(() => {
//     fetchComments();
//   }, [postId]);

//   if (error) {
//     return (
//       <div className="border-t border-gray-200 pt-8 mt-8">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
//         <div className="bg-red-50 border border-red-200 p-4 rounded-sm">
//           <p className="text-red-700">Error loading comments: {error}</p>
//           <button
//             onClick={fetchComments}
//             className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded-sm hover:bg-red-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="border-t border-gray-200 pt-8 mt-8">
//       {/* Header with Minimize Button */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <MessageCircle className="h-6 w-6" />
//           Comments {commentCount > 0 && `(${commentCount})`}
//         </h2>

//         <button
//           onClick={() => setIsMinimized(!isMinimized)}
//           className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
//           title={isMinimized ? "Expand comments" : "Minimize comments"}
//         >
//           {isMinimized ? (
//             <ChevronDown className="h-5 w-5" />
//           ) : (
//             <ChevronUp className="h-5 w-5" />
//           )}
//         </button>
//       </div>

//       <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />

//       {isMinimized && commentCount > 0 && (
//         <div className="bg-gray-50 p-4 rounded-sm mb-4">
//           <div className="flex items-center justify-between">
//             <p className="text-gray-600">
//               {commentCount} comment{commentCount !== 1 ? "s" : ""} hidden
//             </p>
//             <button
//               onClick={() => setIsMinimized(false)}
//               className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//             >
//               Show comments
//             </button>
//           </div>
//         </div>
//       )}

//       {!isMinimized && (
//         <>
//           {isLoading ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="text-gray-500 mt-2">Loading comments...</p>
//             </div>
//           ) : (
//             <CommentList
//               comments={comments}
//               postId={postId}
//               onCommentLike={handleCommentLike}
//               onCommentUpdate={handleCommentUpdate}
//               onCommentDelete={handleCommentDelete} // Pass the delete handler
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default CommentsSection;


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

  // Function to handle comment deletion
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
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-blue-100 mt-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <MessageCircle className="h-8 w-8" />
            Comments
          </h2>
        </div>
        
        <div className="p-8">
          <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="font-bold text-red-800">Error Loading Comments</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchComments}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-blue-100 mt-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <MessageCircle className="h-8 w-8" />
            Comments
            {commentCount > 0 && (
              <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-lg font-bold">
                {commentCount}
              </span>
            )}
          </h2>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-3 text-white hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
            title={isMinimized ? "Expand comments" : "Minimize comments"}
          >
            {isMinimized ? (
              <ChevronDown className="h-6 w-6" />
            ) : (
              <ChevronUp className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        {/* Comment Form */}
        <div className="mb-8">
          <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
        </div>

        {/* Minimized State */}
        {isMinimized && commentCount > 0 && (
          <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-2xl mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-blue-800 font-semibold">
                    {commentCount} comment{commentCount !== 1 ? "s" : ""} hidden
                  </p>
                  <p className="text-blue-600 text-sm">Click to show all comments</p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(false)}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Show Comments
              </button>
            </div>
          </div>
        )}

        {/* Comments Content */}
        {!isMinimized && (
          <>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
                </div>
                <p className="text-gray-600 text-lg font-semibold">Loading comments...</p>
                <p className="text-gray-500 text-sm mt-1">Please wait while we fetch the latest comments</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Comments Yet</h3>
                <p className="text-gray-600">Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-6">
                <CommentList
                  comments={comments}
                  postId={postId}
                  onCommentLike={handleCommentLike}
                  onCommentUpdate={handleCommentUpdate}
                  onCommentDelete={handleCommentDelete}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer for additional actions or info */}
      {!isMinimized && commentCount > 0 && (
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm">
              {commentCount} total comment{commentCount !== 1 ? "s" : ""} in this discussion
            </p>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
            >
              Minimize Comments
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;