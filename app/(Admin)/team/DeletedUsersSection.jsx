// /app/admin/team/DeletedUsersSection.js
"use client";

import { useState } from "react";
import { Trash2, UserX, RefreshCw, Download, Calendar, Filter, AlertTriangle } from "lucide-react";
import * as XLSX from "xlsx";

export default function DeletedUsersSection({ deletedUsers, onRefresh }) {
  const [isLoading, setIsLoading] = useState({});
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterRole, setFilterRole] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  // Calculate time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return "Just now";
  };

  // Filter users
  const filteredUsers = deletedUsers.filter((user) => {
    // Role filter
    if (filterRole !== "all" && user.role !== filterRole) return false;
    
    // Time filter
    if (timeFilter !== "all" && user.deletedAt) {
      const deletedDate = new Date(user.deletedAt);
      const now = new Date();
      const daysDiff = Math.floor((now - deletedDate) / (1000 * 60 * 60 * 24));
      
      switch (timeFilter) {
        case "today": return daysDiff === 0;
        case "week": return daysDiff <= 7;
        case "month": return daysDiff <= 30;
        default: return true;
      }
    }
    
    return true;
  });

  // Handle restore
  const handleRestore = async () => {
    if (!selectedUser) return;
    
    setIsLoading(prev => ({ ...prev, restore: true }));
    
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/restore`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Failed to restore user");
      
      onRefresh();
      setShowRestoreModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error restoring user:", error);
      alert("Failed to restore user. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, restore: false }));
    }
  };

  // Handle permanent delete (purge)
  const handlePurge = async () => {
    if (!selectedUser) return;
    
    setIsLoading(prev => ({ ...prev, purge: true }));
    
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/purge`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to permanently delete user");
      
      onRefresh();
      setShowPurgeModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error purging user:", error);
      alert("Failed to permanently delete user. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, purge: false }));
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const data = filteredUsers.map((user) => ({
      Name: user.name || "No name",
      Email: user.email,
      Role: user.role,
      Level: user.level || "—",
      Semester: user.semester || "—",
      "Deleted Date": user.deletedAt ? new Date(user.deletedAt).toLocaleDateString() : "—",
      "Deleted Time": user.deletedAt ? new Date(user.deletedAt).toLocaleTimeString() : "—",
      "Time Since": user.deletedAt ? getTimeAgo(user.deletedAt) : "—",
      Reason: user.deleteReason || "No reason provided",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "deleted_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (deletedUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <UserX className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Deleted Users</h3>
        <p className="text-gray-500">All users are currently active.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-blue-900">Deleted Users</h2>
          <p className="text-sm text-gray-600">
            Manage soft-deleted users. Restore or permanently delete them.
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Deleted</p>
          <p className="text-2xl font-bold text-red-600">
            {deletedUsers.length}
          </p>
          <div className="text-xs text-gray-500 mt-1">
            {deletedUsers.filter(u => u.role === "STUDENT").length} Students • 
            {deletedUsers.filter(u => u.role === "ADMIN").length} Admins
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Recently Deleted</p>
          <p className="text-2xl font-bold text-orange-600">
            {deletedUsers.filter(u => {
              if (!u.deletedAt) return false;
              const days = (new Date() - new Date(u.deletedAt)) / (1000 * 60 * 60 * 24);
              return days <= 7;
            }).length}
          </p>
          <div className="text-xs text-gray-500 mt-1">
            Last 7 days
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Oldest Deletion</p>
          <p className="text-2xl font-bold text-gray-600">
            {deletedUsers.length > 0 && deletedUsers[0].deletedAt
              ? getTimeAgo(deletedUsers[0].deletedAt)
              : "—"}
          </p>
          <div className="text-xs text-gray-500 mt-1">
            Most recent deletion
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deleted
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <UserX className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {user.name || "No name"}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "ADMIN" 
                      ? "bg-purple-100 text-purple-800" 
                      : user.role === "SUPER_ADMIN"
                      ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.deletedAt ? new Date(user.deletedAt).toLocaleDateString() : "—"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.deletedAt ? getTimeAgo(user.deletedAt) : "—"}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {user.deleteReason || "No reason provided"}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowRestoreModal(true);
                    }}
                    className="text-green-600 hover:text-green-900 inline-flex items-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Restore
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowPurgeModal(true);
                    }}
                    className="text-red-600 hover:text-red-900 inline-flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Purge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No results */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No deleted users match your filters.</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredUsers.length} of {deletedUsers.length} deleted users
      </div>

      {/* Restore Confirmation Modal */}
      {showRestoreModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[28rem] shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <RefreshCw className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-bold text-blue-900">
                Restore User
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to restore <span className="font-semibold">{selectedUser.name || selectedUser.email}</span>?
              <br />
              <span className="text-green-600 font-medium">
                The user will become active again and can sign in normally.
              </span>
            </p>
            {selectedUser.deleteReason && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Deletion reason:</span> {selectedUser.deleteReason}
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRestore}
                disabled={isLoading.restore}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading.restore ? "Restoring..." : "Confirm Restore"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purge Confirmation Modal (DANGEROUS) */}
      {showPurgeModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[28rem] shadow-xl border-2 border-red-200">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-bold text-red-700">
                ⚠️ Permanent Deletion
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              You are about to <span className="font-bold text-red-700">PERMANENTLY DELETE</span>:
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="font-medium text-red-800">{selectedUser.name || "No name"}</p>
              <p className="text-red-700">{selectedUser.email}</p>
              <p className="text-sm text-red-600 mt-2">
                Role: {selectedUser.role} • Deleted: {getTimeAgo(selectedUser.deletedAt)}
              </p>
            </div>
            <div className="space-y-3 mb-6">
              <p className="text-red-600 font-bold">This action cannot be undone:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• User account will be permanently removed from the database</li>
                <li>• All user data will be lost forever</li>
                <li>• Cannot be recovered by any means</li>
                <li>• This is different from soft delete (which can be restored)</li>
              </ul>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPurgeModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel (Keep User)
              </button>
              <button
                onClick={handlePurge}
                disabled={isLoading.purge}
                className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 disabled:opacity-50 font-bold"
              >
                {isLoading.purge ? "Deleting..." : "DELETE PERMANENTLY"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">About Deleted Users:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <span className="font-medium">Soft Delete</span>: User is hidden but can be restored</li>
          <li>• <span className="font-medium">Restore</span>: Returns user to active status</li>
          <li>• <span className="font-medium text-red-600">Purge</span>: <span className="font-bold">PERMANENTLY</span> deletes user (irreversible)</li>
          <li>• Consider exporting data before permanent deletion</li>
        </ul>
      </div>
    </div>
  );
}