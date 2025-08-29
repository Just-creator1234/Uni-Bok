// "use client";

// import { useState, useTransition } from "react";
// import { Trash2 } from "lucide-react";
// import { deletePostById } from "@/app/actions/deletePost";
// import toast from "react-hot-toast";

// export default function BlogItem({ post, onPostUpdated }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isPending, startTransition] = useTransition();

//   const handleDelete = async () => {
//     const result = await deletePostById(post.id);
//     if (result.success) {
//       setIsModalOpen(false);
//       startTransition(() => {
//         onPostUpdated(); // triggers refresh without blocking UI
//       });
//     } else {
//       toast.error("Failed to delete post.");
//     }
//   };

//   return (
//     <>
//       <div className="flex justify-between items-center  rounded mb-3  ">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
//           title="Delete post"
//         >
//           <Trash2 size={16} />
//           <span className="hidden sm:inline">Delete</span>
//         </button>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
//               Confirm Deletion
//             </h2>
//             <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-4">
//               Are you sure you want to delete <strong>{post.title}</strong>?
//               This cannot be undone.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 disabled={isPending}
//                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
//               >
//                 {isPending ? "Deleting..." : "Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { useState, useTransition } from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { deletePostById } from "@/app/actions/deletePost";
import toast from "react-hot-toast";

export default function BlogItem({ post, onPostUpdated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    try {
      const result = await deletePostById(post.id);
      if (result.success) {
        setIsModalOpen(false);
        toast.success("Post deleted successfully");
        startTransition(() => {
          onPostUpdated(); // triggers refresh without blocking UI
        });
      } else {
        toast.error(result.message || "Failed to delete post");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Delete error:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 text-red-600 hover:bg-red-50/50 rounded-lg transition-colors flex items-center gap-1"
        title="Delete post"
      >
        <Trash2 size={16} />
        <span className="hidden sm:inline text-sm">Delete</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in w-full">
          <div
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100/50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Confirm Deletion
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100/50 transition-colors text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">{post.title}</strong>? This
              action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl shadow-sm hover:shadow-md disabled:opacity-70 transition-all flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
