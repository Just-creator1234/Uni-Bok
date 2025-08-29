// "use client";

// import { useState, useTransition } from "react";
// import { deleteMaterial } from "@/action/editmaterials";

// export default function DeleteButton({ id }) {
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [isPending, startTransition] = useTransition();

//   const handleConfirm = () => {
//     startTransition(async () => {
//       await deleteMaterial(id);
//       window.location.reload();
//     });
//   };

//   return (
//     <>
//       <button
//         onClick={() => setShowConfirm(true)}
//         className="text-red-600 hover:underline disabled:opacity-50"
//         disabled={isPending}
//       >
//         {isPending ? "Deleting..." : "Delete"}
//       </button>

//       {showConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               Confirm Deletion
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete this material? This action cannot
//               be undone.
//             </p>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setShowConfirm(false)}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirm}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
import { deleteMaterial } from "@/app/actions/editMaterials";

export default function DeleteButton({ id }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await deleteMaterial(id);
      window.location.reload();
    });
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-600 font-medium hover:underline disabled:opacity-50 transition"
        disabled={isPending}
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white w-[24rem] rounded-lg shadow-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this material? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
