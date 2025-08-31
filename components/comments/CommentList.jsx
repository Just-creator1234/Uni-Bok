// import React from "react";
// import CommentItem from "./CommentItem";

// const CommentList = ({
//   comments,
//   postId,
//   onCommentLike,
//   onCommentUpdate,
//   onCommentDelete,
// }) => {
//   if (!comments || comments.length === 0) {
//     return (
//       <div className="text-center py-8 text-gray-500">
//         No comments yet. Be the first to comment!
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {comments.map((comment) => (
//         <CommentItem
//           key={comment.id}
//           comment={comment}
//           postId={postId}
//           onLike={onCommentLike}
//           onCommentUpdate={onCommentUpdate}
//           onCommentDelete={onCommentDelete}
//         />
//       ))}
//     </div>
//   );
// };

// export default CommentList;

import React from "react";
import CommentItem from "./CommentItem";
import { MessageCircle } from "lucide-react";

const CommentList = ({
  comments,
  postId,
  onCommentLike,
  onCommentUpdate,
  onCommentDelete,
}) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="h-10 w-10 text-blue-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          No Comments Yet
        </h3>
        <p className="text-gray-600 text-lg">
          Be the first to share your thoughts on this post!
        </p>
        <div className="mt-6 p-4 bg-blue-50 rounded-xl max-w-md mx-auto">
          <p className="text-blue-700 text-sm font-semibold">
            💡 Start the conversation
          </p>
          <p className="text-blue-600 text-sm mt-1">
            Your comment could spark an interesting discussion
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              Discussion ({comments.length})
            </h3>
            <p className="text-gray-500 text-sm">
              {comments.length === 1
                ? "1 comment"
                : `${comments.length} comments`}{" "}
              in this thread
            </p>
          </div>
        </div>

        {/* Optional: Sort/Filter controls can go here */}
        <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
          Latest first
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment, index) => (
          <div key={comment.id} className="relative">
            {/* Comment connector line for threaded appearance */}
            {index > 0 && (
              <div className="absolute -top-3 left-6 w-0.5 h-3 bg-blue-100"></div>
            )}

            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-200 transition-colors shadow-sm">
              <CommentItem
                comment={comment}
                postId={postId}
                onLike={onCommentLike}
                onCommentUpdate={onCommentUpdate}
                onCommentDelete={onCommentDelete}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Comments Footer */}
      {comments.length > 3 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 font-semibold text-sm">
                {comments.length} comments loaded
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Keep the conversation going by adding your thoughts above
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentList;
