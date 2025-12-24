// /app/admin/team/CurrentAdminsSection.js
"use client";

import { useState } from "react";
import { UserCheck, UserMinus, Eye, Shield } from "lucide-react";

export default function CurrentAdminsSection({ admins, currentUserId, onRefresh }) {
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDemoteModal, setShowDemoteModal] = useState(false);
  const [adminToDemote, setAdminToDemote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemote = async () => {
    if (!adminToDemote) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/team/${adminToDemote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "STUDENT" })
      });

      if (!response.ok) throw new Error("Failed to demote admin");

      onRefresh();
      setShowDemoteModal(false);
      setAdminToDemote(null);
    } catch (error) {
      console.error("Error demoting admin:", error);
      alert("Failed to demote admin. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-blue-900">Current Admins</h2>
          <p className="text-sm text-gray-600">Manage your admin team members</p>
        </div>
        <div className="text-sm text-gray-500">
          {admins.length} {admins.length === 1 ? "admin" : "admins"}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {admin.name || "No name"}
                        {admin.id === currentUserId && (
                          <span className="ml-2 text-xs font-normal text-blue-600">(You)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {admin.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    admin.role === "SUPER_ADMIN"
                      ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {admin.role === "SUPER_ADMIN" && (
                      <Shield className="h-3 w-3 mr-1" />
                    )}
                    {admin.role}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setSelectedAdmin(admin)}
                    className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  {admin.id !== currentUserId && admin.role !== "SUPER_ADMIN" && (
                    <button
                      onClick={() => {
                        setAdminToDemote(admin);
                        setShowDemoteModal(true);
                      }}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                    >
                      <UserMinus className="h-4 w-4 mr-1" />
                      Demote
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Demote Confirmation Modal */}
      {showDemoteModal && adminToDemote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[28rem] shadow-xl">
            <h3 className="text-lg font-bold text-blue-900 mb-4">
              Demote Admin to Student
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to demote <span className="font-semibold">{adminToDemote.name}</span> ({adminToDemote.email}) to STUDENT role?
              <br />
              <span className="text-red-600 font-medium">
                They will lose all admin privileges immediately.
              </span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDemoteModal(false);
                  setAdminToDemote(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDemote}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? "Demoting..." : "Confirm Demote"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Admin Details Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[28rem] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-900">Admin Details</h3>
              <button
                onClick={() => setSelectedAdmin(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium">{selectedAdmin.name || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{selectedAdmin.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Role</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedAdmin.role === "SUPER_ADMIN"
                    ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
                    : "bg-purple-100 text-purple-800"
                }`}>
                  {selectedAdmin.role}
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-500">Academic Details</label>
                <p className="font-medium">
                  Level {selectedAdmin.level || "N/A"} • {selectedAdmin.semester || "N/A"} Semester
                </p>
                {selectedAdmin.indexNo && (
                  <p className="text-sm text-gray-600">Index: {selectedAdmin.indexNo}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-500">Joined</label>
                <p className="font-medium">
                  {new Date(selectedAdmin.createdAt).toLocaleDateString()} at{" "}
                  {new Date(selectedAdmin.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedAdmin(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}