// components/comments/DeleteConfirmationModal.jsx
"use client";
import React from "react";
import { X, AlertTriangle, Shield } from "lucide-react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  isAdminAction = false,
  commentAuthorName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg  w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2 rounded-full ${
              isAdminAction ? "bg-red-100" : "bg-orange-100"
            }`}
          >
            {isAdminAction ? (
              <Shield className="h-6 w-6 text-red-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {isAdminAction ? "Moderate Comment" : "Delete Comment"}
            </h3>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          {isAdminAction
            ? `You are about to remove ${commentAuthorName}'s comment as an administrator. This action will be logged.`
            : "Are you sure you want to delete your comment? This action cannot be undone."}
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`px-4 py-2 text-white rounded-md disabled:opacity-50 ${
              isAdminAction
                ? "bg-red-600 hover:bg-red-700"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {isDeleting
              ? "Deleting..."
              : isAdminAction
              ? "Remove Comment"
              : "Delete"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
