// "use client";
// import React, { useState } from "react";
// import CommentForm from "./CommentForm";
// import {
//   ChevronDown,
//   ChevronRight,
//   Minus,
//   Plus,
//   Edit,
//   X,
//   Check,
//   MoreVertical,
//   Trash2,
//   Shield,
// } from "lucide-react";
// import { useSession } from "next-auth/react";

// const CommentItem = ({
//   comment,
//   postId,
//   level = 0,
//   onLike,
//   onCommentUpdate,
//   onCommentDelete, // Added missing prop
// }) => {
//   const [showReplyForm, setShowReplyForm] = useState(false);
//   const [isLiking, setIsLiking] = useState(false);
//   const [localLikes, setLocalLikes] = useState(comment.likes || 0);
//   const [hasLiked, setHasLiked] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState(comment.content);
//   const [isEditingLoading, setIsEditingLoading] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false); // Added missing state
//   const [isDeleting, setIsDeleting] = useState(false); // Added missing state

//   const { data: session } = useSession();
//   const isAuthor = session?.user?.id === comment.authorId;
//   const isAdmin = session?.user?.role === "ADMIN";
//   const canDelete = isAuthor || isAdmin;
//   const isAdminAction = isAdmin && !isAuthor;

//   const handleDelete = async () => {
//     setIsDeleting(true);

//     try {
//       const response = await fetch(`/api/comments/${comment.id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to delete comment");
//       }

//       const result = await response.json();

//       // Notify parent component
//       onCommentDelete?.(comment.id, result.deletedByAdmin);

//       setShowDeleteModal(false);
//       setShowMenu(false);
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//       alert(error.message || "Error deleting comment. Please try again.");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleLike = async () => {
//     if (hasLiked || isLiking) return;
//     setIsLiking(true);

//     try {
//       setLocalLikes((prev) => prev + 1);
//       setHasLiked(true);

//       const response = await fetch(`/api/comments/${comment.id}/like`, {
//         method: "POST",
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to like comment");
//       }

//       const data = await response.json();
//       setLocalLikes(data.likes);
//       onLike?.(comment.id, data.likes);
//     } catch (error) {
//       console.error("Error liking comment:", error);
//       setLocalLikes((prev) => prev - 1);
//       setHasLiked(false);
//       alert(error.message || "Error liking comment. Please try again.");
//     } finally {
//       setIsLiking(false);
//     }
//   };

//   const handleReplyAdded = () => {
//     setShowReplyForm(false);
//   };

//   const handleEdit = async () => {
//     if (!editContent.trim() || editContent === comment.content) {
//       setIsEditing(false);
//       return;
//     }

//     setIsEditingLoading(true);

//     try {
//       const response = await fetch(`/api/comments/${comment.id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           content: editContent,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to update comment");
//       }

//       const updatedComment = await response.json();

//       // Notify parent component of the update
//       onCommentUpdate?.(updatedComment);

//       setIsEditing(false);
//       setShowMenu(false);
//     } catch (error) {
//       console.error("Error updating comment:", error);
//       alert(error.message || "Error updating comment. Please try again.");
//     } finally {
//       setIsEditingLoading(false);
//     }
//   };

//   const cancelEdit = () => {
//     setEditContent(comment.content);
//     setIsEditing(false);
//     setShowMenu(false);
//   };

//   const hasReplies = comment.replies && comment.replies.length > 0;

//   return (
//     <div
//       className={`${level > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""}`}
//     >
//       {/* Comment Header with Collapse Button */}
//       <div className="flex items-start gap-2 mb-2">
//         {hasReplies && (
//           <button
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="p-1 text-gray-400 hover:text-gray-600 transition-colors mt-1"
//             title={isCollapsed ? "Expand thread" : "Collapse thread"}
//           >
//             {isCollapsed ? (
//               <ChevronRight className="h-4 w-4" />
//             ) : (
//               <ChevronDown className="h-4 w-4" />
//             )}
//           </button>
//         )}

//         {/* Comment Content */}
//         <div className="bg-gray-50 p-4 rounded-sm flex-1 relative">
//           {/* Edit/Delete Menu Button (for authorized users) */}
//           {canDelete && !isEditing && (
//             <div className="absolute top-3 right-3">
//               <button
//                 onClick={() => setShowMenu(!showMenu)}
//                 className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
//                 title="More options"
//               >
//                 <MoreVertical className="h-4 w-4" />
//               </button>

//               {showMenu && (
//                 <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-10 w-32">
//                   {isAuthor && (
//                     <button
//                       onClick={() => {
//                         setIsEditing(true);
//                         setShowMenu(false);
//                       }}
//                       className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                     >
//                       <Edit className="h-3 w-3" />
//                       Edit
//                     </button>
//                   )}
//                   <button
//                     onClick={() => {
//                       setShowDeleteModal(true);
//                       setShowMenu(false);
//                     }}
//                     className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
//                   >
//                     {isAdminAction ? (
//                       <>
//                         <Shield className="h-3 w-3" />
//                         Moderate
//                       </>
//                     ) : (
//                       <>
//                         <Trash2 className="h-3 w-3" />
//                         Delete
//                       </>
//                     )}
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="flex items-start gap-3">
//             <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
//               <span className="text-sm font-medium text-gray-600">
//                 {comment.author?.name?.charAt(0)?.toUpperCase() || "U"}
//               </span>
//             </div>

//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-2">
//                 <h4 className="font-semibold text-gray-900 text-sm">
//                   {comment.author?.name || "Anonymous"}
//                 </h4>
//                 <span className="text-gray-500 text-xs">
//                   {new Date(comment.createdAt).toLocaleDateString()}
//                 </span>
//                 {comment.isEdited && (
//                   <span className="text-gray-400 text-xs italic">(edited)</span>
//                 )}
//               </div>

//               {isEditing ? (
//                 <div className="mb-3">
//                   <textarea
//                     value={editContent}
//                     onChange={(e) => setEditContent(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                     rows={3}
//                     disabled={isEditingLoading}
//                   />
//                   <div className="flex gap-2 mt-2">
//                     <button
//                       onClick={handleEdit}
//                       disabled={isEditingLoading || !editContent.trim()}
//                       className="px-3 py-1 bg-blue-600 text-white text-xs rounded-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
//                     >
//                       <Check className="h-3 w-3" />
//                       Save
//                     </button>
//                     <button
//                       onClick={cancelEdit}
//                       disabled={isEditingLoading}
//                       className="px-3 py-1 border border-gray-300 text-gray-600 text-xs rounded-sm hover:bg-gray-50 flex items-center gap-1"
//                     >
//                       <X className="h-3 w-3" />
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">
//                   {comment.content}
//                 </p>
//               )}

//               {!isEditing && (
//                 <div className="flex items-center gap-4">
//                   <button
//                     onClick={handleLike}
//                     disabled={isLiking || hasLiked}
//                     className={`flex items-center gap-1 text-xs transition-colors ${
//                       hasLiked
//                         ? "text-blue-600 cursor-default"
//                         : "text-gray-500 hover:text-gray-700 disabled:opacity-50"
//                     }`}
//                   >
//                     <span className="text-base">👍</span>
//                     <span>{localLikes}</span>
//                     {hasLiked && <span className="text-xs">Liked</span>}
//                   </button>

//                   <button
//                     onClick={() => setShowReplyForm(!showReplyForm)}
//                     className="text-blue-600 hover:text-blue-800 text-xs"
//                   >
//                     Reply
//                   </button>

//                   {/* Collapse button for mobile */}
//                   {hasReplies && (
//                     <button
//                       onClick={() => setIsCollapsed(!isCollapsed)}
//                       className="md:hidden text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1"
//                     >
//                       {isCollapsed ? (
//                         <>
//                           <Plus className="h-3 w-3" />
//                           <span>Show replies ({comment.replies.length})</span>
//                         </>
//                       ) : (
//                         <>
//                           <Minus className="h-3 w-3" />
//                           <span>Hide replies</span>
//                         </>
//                       )}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Reply Form */}
//       {showReplyForm && (
//         <CommentForm
//           postId={postId}
//           parentId={comment.id}
//           onCommentAdded={handleReplyAdded}
//           onCancel={() => setShowReplyForm(false)}
//         />
//       )}

//       {/* Nested Replies - Only show if not collapsed */}
//       {!isCollapsed && hasReplies && (
//         <div className="mt-2">
//           {comment.replies.map((reply) => (
//             <CommentItem
//               key={reply.id}
//               comment={reply}
//               postId={postId}
//               level={level + 1}
//               onLike={onLike}
//               onCommentUpdate={onCommentUpdate}
//               onCommentDelete={onCommentDelete}
//             />
//           ))}
//         </div>
//       )}

//       {/* Collapsed state indicator */}
//       {isCollapsed && hasReplies && (
//         <div className="bg-gray-100 p-3 rounded-sm mb-3">
//           <button
//             onClick={() => setIsCollapsed(false)}
//             className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2"
//           >
//             <ChevronRight className="h-4 w-4" />
//             <span>
//               {comment.replies.length} repl
//               {comment.replies.length === 1 ? "y" : "ies"} collapsed
//             </span>
//           </button>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className={`p-2 rounded-full ${isAdminAction ? 'bg-red-100' : 'bg-orange-100'}`}>
//                 {isAdminAction ? (
//                   <Shield className="h-6 w-6 text-red-600" />
//                 ) : (
//                   <span className="text-orange-600">⚠️</span>
//                 )}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900">
//                   {isAdminAction ? 'Moderate Comment' : 'Delete Comment'}
//                 </h3>
//               </div>
//             </div>

//             <p className="text-gray-600 mb-6">
//               {isAdminAction
//                 ? `You are about to remove ${comment.author?.name}'s comment as an administrator. This action will be logged.`
//                 : 'Are you sure you want to delete your comment? This action cannot be undone.'
//               }
//             </p>

//             <div className="flex gap-3 justify-end">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 disabled={isDeleting}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 disabled={isDeleting}
//                 className={`px-4 py-2 text-white rounded-md disabled:opacity-50 ${
//                   isAdminAction
//                     ? 'bg-red-600 hover:bg-red-700'
//                     : 'bg-orange-600 hover:bg-orange-700'
//                 }`}
//               >
//                 {isDeleting ? 'Deleting...' : (isAdminAction ? 'Remove Comment' : 'Delete')}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CommentItem;

"use client";
import React, { useState } from "react";
import CommentForm from "./CommentForm";
import {
  ChevronDown,
  ChevronRight,
  Minus,
  Plus,
  Edit,
  X,
  Check,
  MoreVertical,
  Trash2,
  Shield,
  User,
  Calendar,
  Heart,
  MessageSquare,
} from "lucide-react";
import { useSession } from "next-auth/react";

const CommentItem = ({
  comment,
  postId,
  level = 0,
  onLike,
  onCommentUpdate,
  onCommentDelete,
  onCommentAdded,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [localLikes, setLocalLikes] = useState(comment.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: session } = useSession();
  const isAuthor = session?.user?.id === comment.authorId;
  const isAdmin = session?.user?.role === "ADMIN";
  const canDelete = isAuthor || isAdmin;
  const isAdminAction = isAdmin && !isAuthor;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete comment");
      }

      const result = await response.json();
      onCommentDelete?.(comment.id, result.deletedByAdmin);
      setShowDeleteModal(false);
      setShowMenu(false);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert(error.message || "Error deleting comment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = async () => {
    if (hasLiked || isLiking) return;
    setIsLiking(true);

    try {
      setLocalLikes((prev) => prev + 1);
      setHasLiked(true);

      const response = await fetch(`/api/comments/${comment.id}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to like comment");
      }

      const data = await response.json();
      setLocalLikes(data.likes);
      onLike?.(comment.id, data.likes);
    } catch (error) {
      console.error("Error liking comment:", error);
      setLocalLikes((prev) => prev - 1);
      setHasLiked(false);
      alert(error.message || "Error liking comment. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleReplyAdded = () => {
    setShowReplyForm(false);
    // Notify parent component (CommentsSection) to refresh comments
    onCommentAdded?.();
  };

  const handleEdit = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      return;
    }

    setIsEditingLoading(true);

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update comment");
      }

      const updatedComment = await response.json();
      onCommentUpdate?.(updatedComment);
      setIsEditing(false);
      setShowMenu(false);
    } catch (error) {
      console.error("Error updating comment:", error);
      alert(error.message || "Error updating comment. Please try again.");
    } finally {
      setIsEditingLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
    setShowMenu(false);
  };

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div
      className={`${
        level > 0 ? "ml-8 border-l-4 border-blue-100 pl-6" : ""
      } mb-4`}
    >
      {/* Comment Card */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-200">
        {/* Comment Header */}
        <div className="flex items-start gap-4 p-6 pb-4">
          {/* Collapse Button */}
          {hasReplies && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="mt-2 p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title={isCollapsed ? "Expand thread" : "Collapse thread"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-lg font-bold text-white">
              {comment.author?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h4 className="font-bold text-gray-800 text-lg">
                  {comment.author?.name || "Anonymous"}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                  {comment.isEdited && (
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold">
                      edited
                    </span>
                  )}
                </div>
              </div>

              {/* Options Menu */}
              {canDelete && !isEditing && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {showMenu && (
                    <div className="absolute top-full right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-10 w-40 overflow-hidden">
                      {isAuthor && (
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                          Edit Comment
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setShowDeleteModal(true);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        {isAdminAction ? (
                          <>
                            <Shield className="h-4 w-4" />
                            Moderate
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Comment Text / Edit Form */}
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-500 focus:ring-0 transition-colors"
                  rows={4}
                  disabled={isEditingLoading}
                  placeholder="Edit your comment..."
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleEdit}
                    disabled={isEditingLoading || !editContent.trim()}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={isEditingLoading}
                    className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 flex items-center gap-2 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-6 pt-2 border-t border-gray-100">
                  <button
                    onClick={handleLike}
                    disabled={isLiking || hasLiked}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                      hasLiked
                        ? "text-red-600 bg-red-50"
                        : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                    } disabled:opacity-50`}
                  >
                    <Heart
                      className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`}
                    />
                    <span>{localLikes}</span>
                    {hasLiked && <span className="text-sm">Liked</span>}
                  </button>

                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Reply
                  </button>

                  {/* Mobile Collapse Button */}
                  {hasReplies && (
                    <button
                      onClick={() => setIsCollapsed(!isCollapsed)}
                      className="md:hidden flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold transition-colors"
                    >
                      {isCollapsed ? (
                        <>
                          <Plus className="h-4 w-4" />
                          <span>Show {comment.replies.length} replies</span>
                        </>
                      ) : (
                        <>
                          <Minus className="h-4 w-4" />
                          <span>Hide replies</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="px-6 pb-6">
            <div className="border-t-2 border-blue-100 pt-4">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onCommentAdded={handleReplyAdded} // This now properly chains up
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {!isCollapsed && hasReplies && (
        <div className="mt-6 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              level={level + 1}
              onLike={onLike}
              onCommentUpdate={onCommentUpdate}
              onCommentDelete={onCommentDelete}
              onCommentAdded={onCommentAdded} // Pass callback to nested replies
            />
          ))}
        </div>
      )}

      {/* Collapsed State Indicator */}
      {isCollapsed && hasReplies && (
        <div className="mt-4 bg-blue-50 border-2 border-blue-200 p-4 rounded-2xl">
          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-3 text-blue-700 hover:text-blue-800 font-semibold transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
            <span>
              Show {comment.replies.length} repl
              {comment.replies.length === 1 ? "y" : "ies"}
            </span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-200">
            <div className="text-center mb-6">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isAdminAction ? "bg-red-100" : "bg-orange-100"
                }`}
              >
                {isAdminAction ? (
                  <Shield className="h-8 w-8 text-red-600" />
                ) : (
                  <span className="text-orange-600 text-2xl">⚠️</span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {isAdminAction ? "Moderate Comment" : "Delete Comment?"}
              </h3>
            </div>

            <p className="text-gray-600 text-center leading-relaxed mb-8">
              {isAdminAction
                ? `You are about to remove ${comment.author?.name}'s comment as an administrator. This action will be logged.`
                : "Are you sure you want to delete your comment? This action cannot be undone."}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Keep Comment
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`flex-1 px-6 py-3 text-white font-semibold rounded-xl disabled:opacity-50 transition-colors ${
                  isAdminAction
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {isDeleting
                  ? "Deleting..."
                  : isAdminAction
                  ? "Remove Comment"
                  : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
