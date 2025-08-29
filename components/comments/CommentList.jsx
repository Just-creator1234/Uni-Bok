import React from "react";
import CommentItem from "./CommentItem";

const CommentList = ({
  comments,
  postId,
  onCommentLike,
  onCommentUpdate,
  onCommentDelete,
}) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          onLike={onCommentLike}
          onCommentUpdate={onCommentUpdate}
          onCommentDelete={onCommentDelete}
        />
      ))}
    </div>
  );
};

export default CommentList;
