// // /app/admin/team/AllUsersSection.js
// "use client";

// import { useState, useEffect } from "react";
// import {
//   UserCheck,
//   UserMinus,
//   Eye,
//   Shield,
//   Trash2,
//   Edit,
//   UserPlus,
//   CheckCircle,
//   XCircle,
//   Save,
//   X,
//   AlertTriangle,
// } from "lucide-react";

// export default function AllUsersSection({ users, currentUserId, onRefresh }) {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [userToAction, setUserToAction] = useState(null);
//   const [deleteReason, setDeleteReason] = useState("");
//   const [isLoading, setIsLoading] = useState({});
//   const [filterRole, setFilterRole] = useState("all");
//   const [filterLevel, setFilterLevel] = useState("all");
//   const [filterSemester, setFilterSemester] = useState("all");

//   // Edit form state
//   const [editForm, setEditForm] = useState({
//     name: "",
//     level: "",
//     semester: "",
//     indexNo: "",
//     role: "STUDENT",
//   });

//   // Initialize edit form when user is selected for editing
//   useEffect(() => {
//     if (showEditModal && selectedUser) {
//       setEditForm({
//         name: selectedUser.name || "",
//         level: selectedUser.level || "",
//         semester: selectedUser.semester || "",
//         indexNo: selectedUser.indexNo || "",
//         role: selectedUser.role || "STUDENT",
//       });
//     }
//   }, [showEditModal, selectedUser]);

//   // Filter users (only show active users)
//   const filteredUsers = users.filter((user) => {
//     // Hide deleted users in this tab
//     if (user.isDeleted) return false;

//     // Role filter
//     if (filterRole !== "all" && user.role !== filterRole) return false;

//     // Level filter
//     if (filterLevel !== "all" && user.level !== filterLevel) return false;

//     // Semester filter
//     if (filterSemester !== "all" && user.semester !== filterSemester)
//       return false;

//     return true;
//   });

//   // Handle delete (soft delete)
//   const handleDelete = async () => {
//     if (!userToAction) return;

//     setIsLoading((prev) => ({ ...prev, delete: true }));

//     try {
//       const response = await fetch(
//         `/api/admin/users/${userToAction.id}/delete`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ reason: deleteReason }),
//         }
//       );

//       if (!response.ok) throw new Error("Failed to delete user");

//       onRefresh();
//       setShowDeleteModal(false);
//       setUserToAction(null);
//       setDeleteReason("");
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       alert("Failed to delete user. Please try again.");
//     } finally {
//       setIsLoading((prev) => ({ ...prev, delete: false }));
//     }
//   };

//   // Handle edit user (includes role changes)
//   const handleEdit = async () => {
//     if (!selectedUser) return;

//     setIsLoading((prev) => ({ ...prev, edit: true }));

//     try {
//       const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(editForm),
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.error || "Failed to update user");
//       }

//       onRefresh();
//       setShowEditModal(false);
//       setSelectedUser(null);
//       alert("User updated successfully!");
//     } catch (error) {
//       console.error("Error updating user:", error);
//       alert(error.message || "Failed to update user. Please try again.");
//     } finally {
//       setIsLoading((prev) => ({ ...prev, edit: false }));
//     }
//   };

//   // Check if role change requires special handling
//   const getRoleChangeMessage = (oldRole, newRole) => {
//     if (oldRole === "STUDENT" && newRole === "ADMIN") {
//       return "This will send an admin invite email to the user. They'll need to accept to become an ADMIN.";
//     }
//     if (oldRole === "ADMIN" && newRole === "STUDENT") {
//       return "This will immediately demote the user to STUDENT. They'll lose admin privileges.";
//     }
//     if (newRole === "SUPER_ADMIN") {
//       return "SUPER_ADMIN is a protected role. Only current SUPER_ADMIN can assign this role.";
//     }
//     return null;
//   };

//   // Calculate stats
//   const activeUsers = users.filter((u) => !u.isDeleted).length;
//   const deletedUsers = users.filter((u) => u.isDeleted).length;
//   const adminCount = users.filter(
//     (u) => u.role === "ADMIN" && !u.isDeleted
//   ).length;
//   const studentCount = users.filter(
//     (u) => u.role === "STUDENT" && !u.isDeleted
//   ).length;

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
//         <div>
//           <h2 className="text-xl font-bold text-blue-900">All Users</h2>
//           <p className="text-sm text-gray-600">
//             Manage all platform users. Use Edit to change roles or details.
//           </p>
//         </div>
//         <div className="text-sm text-gray-500">
//           {activeUsers} active • {deletedUsers} deleted
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//           <p className="text-sm text-gray-500">Active Users</p>
//           <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
//           <div className="text-xs text-gray-500 mt-1">
//             {adminCount} Admins • {studentCount} Students
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//           <p className="text-sm text-gray-500">Deleted Users</p>
//           <p className="text-2xl font-bold text-red-600">{deletedUsers}</p>
//           <div className="text-xs text-gray-500 mt-1">In recycle bin</div>
//         </div>
//         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//           <p className="text-sm text-gray-500">SUPER_ADMIN</p>
//           <p className="text-2xl font-bold text-purple-600">
//             {
//               users.filter((u) => u.role === "SUPER_ADMIN" && !u.isDeleted)
//                 .length
//             }
//           </p>
//           <div className="text-xs text-gray-500 mt-1">Protected role</div>
//         </div>
//         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//           <p className="text-sm text-gray-500">Showing</p>
//           <p className="text-2xl font-bold text-blue-600">
//             {filteredUsers.length}
//           </p>
//           <div className="text-xs text-gray-500 mt-1">After filters</div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <select
//           value={filterRole}
//           onChange={(e) => setFilterRole(e.target.value)}
//           className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="all">All Roles</option>
//           <option value="STUDENT">Students</option>
//           <option value="ADMIN">Admins</option>
//           <option value="SUPER_ADMIN">SUPER_ADMIN</option>
//         </select>

//         <select
//           value={filterLevel}
//           onChange={(e) => setFilterLevel(e.target.value)}
//           className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="all">All Levels</option>
//           <option value="100">100 Level</option>
//           <option value="200">200 Level</option>
//           <option value="300">300 Level</option>
//           <option value="400">400 Level</option>
//         </select>

//         <select
//           value={filterSemester}
//           onChange={(e) => setFilterSemester(e.target.value)}
//           className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="all">All Semesters</option>
//           <option value="First">First Semester</option>
//           <option value="Second">Second Semester</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Email
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Role
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Academic
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredUsers.map((user) => (
//               <tr key={user.id} className="hover:bg-gray-50">
//                 <td className="px-4 py-3 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
//                       <UserCheck className="h-4 w-4 text-blue-600" />
//                     </div>
//                     <div className="ml-3">
//                       <div className="font-medium text-gray-900">
//                         {user.name || "No name"}
//                         {user.id === currentUserId && (
//                           <span className="ml-2 text-xs font-normal text-blue-600">
//                             (You)
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                   {user.email}
//                 </td>
//                 <td className="px-4 py-3 whitespace-nowrap">
//                   <span
//                     className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       user.role === "SUPER_ADMIN"
//                         ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
//                         : user.role === "ADMIN"
//                         ? "bg-purple-100 text-purple-800"
//                         : "bg-blue-100 text-blue-800"
//                     }`}
//                   >
//                     {user.role === "SUPER_ADMIN" && (
//                       <Shield className="h-3 w-3 mr-1" />
//                     )}
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                   {user.level && user.semester ? (
//                     <>
//                       Level {user.level}
//                       <br />
//                       <span className="text-gray-500">
//                         {user.semester} Semester
//                       </span>
//                     </>
//                   ) : (
//                     <span className="text-gray-400">—</span>
//                   )}
//                 </td>
//                 <td className="px-4 py-3 whitespace-nowrap">
//                   {user.isDeleted ? (
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                       <XCircle className="h-3 w-3 mr-1" />
//                       Deleted
//                     </span>
//                   ) : (
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                       <CheckCircle className="h-3 w-3 mr-1" />
//                       Active
//                     </span>
//                   )}
//                 </td>
//                 <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
//                   <button
//                     onClick={() => setSelectedUser(user)}
//                     className="text-blue-600 hover:text-blue-900 inline-flex items-center"
//                   >
//                     <Eye className="h-4 w-4 mr-1" />
//                     View
//                   </button>

//                   {/* Edit button - for all users */}
//                   <button
//                     onClick={() => {
//                       setSelectedUser(user);
//                       setShowEditModal(true);
//                     }}
//                     className="text-yellow-600 hover:text-yellow-900 inline-flex items-center"
//                   >
//                     <Edit className="h-4 w-4 mr-1" />
//                     Edit
//                   </button>

//                   {/* Delete button - for non-SUPER_ADMIN users (except self) */}
//                   {user.id !== currentUserId && user.role !== "SUPER_ADMIN" && (
//                     <button
//                       onClick={() => {
//                         setUserToAction(user);
//                         setShowDeleteModal(true);
//                       }}
//                       className="text-red-600 hover:text-red-900 inline-flex items-center"
//                     >
//                       <Trash2 className="h-4 w-4 mr-1" />
//                       Delete
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Empty state */}
//       {filteredUsers.length === 0 && (
//         <div className="text-center py-12">
//           <UserCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             No Active Users
//           </h3>
//           <p className="text-gray-500">
//             Try changing your filters or check the Deleted Users tab.
//           </p>
//         </div>
//       )}

//       {/* Footer */}
//       <div className="mt-4 text-sm text-gray-500">
//         Showing {filteredUsers.length} of {activeUsers} active users
//       </div>

//       {/* ========== MODALS ========== */}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && userToAction && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-[28rem] shadow-xl">
//             <h3 className="text-lg font-bold text-blue-900 mb-4">
//               Delete User
//             </h3>
//             <p className="text-gray-600 mb-4">
//               Are you sure you want to delete{" "}
//               <span className="font-semibold">
//                 {userToAction.name || userToAction.email}
//               </span>
//               ?
//               <br />
//               <span className="text-red-600 font-medium">
//                 User will be moved to Deleted Users section and can be restored
//                 later.
//               </span>
//             </p>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Reason for deletion (optional):
//               </label>
//               <textarea
//                 value={deleteReason}
//                 onChange={(e) => setDeleteReason(e.target.value)}
//                 placeholder="e.g., Inactive account, duplicate, requested deletion..."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 rows="3"
//               />
//             </div>

//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   setUserToAction(null);
//                   setDeleteReason("");
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 disabled={isLoading.delete}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
//               >
//                 {isLoading.delete ? "Deleting..." : "Confirm Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit User Modal */}
//       {showEditModal && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
//           <div className="bg-white rounded-lg p-6 w-[28rem] my-8 shadow-xl">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-bold text-blue-900">Edit User</h3>
//               <button
//                 onClick={() => {
//                   setShowEditModal(false);
//                   setSelectedUser(null);
//                 }}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div className="bg-blue-50 p-3 rounded-lg mb-4">
//                 <p className="text-sm text-blue-700">
//                   Editing:{" "}
//                   <span className="font-medium">{selectedUser.email}</span>
//                 </p>
//                 {selectedUser.role !== editForm.role && (
//                   <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
//                     <p className="text-sm text-yellow-700">
//                       <AlertTriangle className="h-4 w-4 inline mr-1" />
//                       {getRoleChangeMessage(selectedUser.role, editForm.role)}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   value={editForm.name}
//                   onChange={(e) =>
//                     setEditForm((prev) => ({ ...prev, name: e.target.value }))
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter full name"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Level
//                   </label>
//                   <select
//                     value={editForm.level}
//                     onChange={(e) =>
//                       setEditForm((prev) => ({
//                         ...prev,
//                         level: e.target.value,
//                       }))
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select Level</option>
//                     <option value="100">100 Level</option>
//                     <option value="200">200 Level</option>
//                     <option value="300">300 Level</option>
//                     <option value="400">400 Level</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Semester
//                   </label>
//                   <select
//                     value={editForm.semester}
//                     onChange={(e) =>
//                       setEditForm((prev) => ({
//                         ...prev,
//                         semester: e.target.value,
//                       }))
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select Semester</option>
//                     <option value="First">First Semester</option>
//                     <option value="Second">Second Semester</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Index Number
//                 </label>
//                 <input
//                   type="text"
//                   value={editForm.indexNo}
//                   onChange={(e) =>
//                     setEditForm((prev) => ({
//                       ...prev,
//                       indexNo: e.target.value,
//                     }))
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="e.g., BS/MBB/23/0011"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Role
//                 </label>
//                 <select
//                   value={editForm.role}
//                   onChange={(e) =>
//                     setEditForm((prev) => ({ ...prev, role: e.target.value }))
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   disabled={selectedUser.role === "SUPER_ADMIN"}
//                 >
//                   <option value="STUDENT">STUDENT</option>
//                   <option value="ADMIN">ADMIN</option>
//                   <option
//                     value="SUPER_ADMIN"
//                     disabled={selectedUser.id === currentUserId}
//                   >
//                     SUPER_ADMIN{" "}
//                     {selectedUser.id === currentUserId &&
//                       "(Cannot self-assign)"}
//                   </option>
//                 </select>
//                 <p className="text-xs text-gray-500 mt-1">
//                   • STUDENT → ADMIN: Sends invite email
//                   <br />
//                   • ADMIN → STUDENT: Immediate demotion
//                   <br />• SUPER_ADMIN: Protected role (requires confirmation)
//                 </p>
//               </div>
//             </div>

//             <div className="mt-6 flex justify-end space-x-3">
//               <button
//                 onClick={() => {
//                   setShowEditModal(false);
//                   setSelectedUser(null);
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEdit}
//                 disabled={isLoading.edit}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 inline-flex items-center"
//               >
//                 <Save className="h-4 w-4 mr-2" />
//                 {isLoading.edit ? "Saving..." : "Save Changes"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View User Details Modal */}
//       {selectedUser && !showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-[28rem] shadow-xl">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-bold text-blue-900">User Details</h3>
//               <button
//                 onClick={() => setSelectedUser(null)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm text-gray-500">Name</label>
//                 <p className="font-medium">
//                   {selectedUser.name || "Not provided"}
//                 </p>
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500">Email</label>
//                 <p className="font-medium">{selectedUser.email}</p>
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500">Role</label>
//                 <span
//                   className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                     selectedUser.role === "SUPER_ADMIN"
//                       ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
//                       : selectedUser.role === "ADMIN"
//                       ? "bg-purple-100 text-purple-800"
//                       : "bg-blue-100 text-blue-800"
//                   }`}
//                 >
//                   {selectedUser.role}
//                 </span>
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500">
//                   Academic Details
//                 </label>
//                 <p className="font-medium">
//                   {selectedUser.level ? `Level ${selectedUser.level}` : "N/A"} •
//                   {selectedUser.semester
//                     ? ` ${selectedUser.semester} Semester`
//                     : " N/A"}
//                 </p>
//                 {selectedUser.indexNo && (
//                   <p className="text-sm text-gray-600">
//                     Index: {selectedUser.indexNo}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500">Status</label>
//                 <span
//                   className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                     selectedUser.isDeleted
//                       ? "bg-red-100 text-red-800"
//                       : "bg-green-100 text-green-800"
//                   }`}
//                 >
//                   {selectedUser.isDeleted ? "❌ Deleted" : "✅ Active"}
//                 </span>
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500">Joined</label>
//                 <p className="font-medium">
//                   {new Date(selectedUser.createdAt).toLocaleDateString()} at{" "}
//                   {new Date(selectedUser.createdAt).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </p>
//               </div>
//               {selectedUser.isDeleted && selectedUser.deletedAt && (
//                 <div className="bg-red-50 p-3 rounded-lg">
//                   <label className="text-sm text-gray-500 font-medium">
//                     Deletion Info
//                   </label>
//                   <p className="text-sm text-gray-700">
//                     Deleted:{" "}
//                     {new Date(selectedUser.deletedAt).toLocaleDateString()}
//                   </p>
//                   {selectedUser.deleteReason && (
//                     <p className="text-sm text-gray-600 mt-1">
//                       Reason: {selectedUser.deleteReason}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>

//             <div className="mt-6 flex justify-end space-x-2">
//               <button
//                 onClick={() => {
//                   setShowEditModal(true);
//                 }}
//                 className="px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50"
//               >
//                 <Edit className="h-4 w-4 inline mr-2" />
//                 Edit User
//               </button>
//               <button
//                 onClick={() => setSelectedUser(null)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Info Box */}
//       <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//         <h4 className="font-medium text-blue-800 mb-2">
//           User Management Guide:
//         </h4>
//         <ul className="text-sm text-blue-700 space-y-1">
//           <li>
//             • <span className="font-medium">Edit User</span>: Change details OR
//             role (includes making admin or demoting)
//           </li>
//           <li>
//             • <span className="font-medium">STUDENT → ADMIN</span>: Sends admin
//             invite email
//           </li>
//           <li>
//             • <span className="font-medium">ADMIN → STUDENT</span>: Immediate
//             demotion (no invite needed)
//           </li>
//           <li>
//             • <span className="font-medium">Delete</span>: Moves user to Deleted
//             Users tab (soft delete)
//           </li>
//           <li>
//             • SUPER_ADMIN users cannot be deleted or have their role changed
//           </li>
//           <li>• You cannot assign SUPER_ADMIN role to yourself</li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// /app/admin/team/AllUsersSection.js
"use client";

import { useState, useEffect } from "react";
import {
  UserCheck,
  Eye,
  Shield,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Save,
  X,
  AlertTriangle,
  RefreshCw,
  Filter,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AllUsersSection({ users, currentUserId, onRefresh }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToAction, setUserToAction] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [isLoading, setIsLoading] = useState({});
  const [filterRole, setFilterRole] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterSemester, setFilterSemester] = useState("all");
  const [filterStatus, setFilterStatus] = useState("active");

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    level: "",
    semester: "",
    indexNo: "",
    role: "STUDENT",
  });

  // Initialize edit form when user is selected for editing
  useEffect(() => {
    if (showEditModal && selectedUser) {
      setEditForm({
        name: selectedUser.name || "",
        level: selectedUser.level || "",
        semester: selectedUser.semester || "",
        indexNo: selectedUser.indexNo || "",
        role: selectedUser.role || "STUDENT",
      });
    }
  }, [showEditModal, selectedUser]);

  // Filter users
  const filteredUsers = users.filter((user) => {
    // Status filter
    if (filterStatus === "active" && user.isDeleted) return false;
    if (filterStatus === "deleted" && !user.isDeleted) return false;

    // Role filter
    if (filterRole !== "all" && user.role !== filterRole) return false;

    // Level filter
    if (filterLevel !== "all" && user.level !== filterLevel) return false;

    // Semester filter
    if (filterSemester !== "all" && user.semester !== filterSemester)
      return false;

    return true;
  });

  // Handle refresh
  const handleRefreshClick = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, refresh: true }));
      await onRefresh();
      toast.success("Users refreshed successfully!");
    } catch (error) {
      toast.error("Failed to refresh users");
      console.error("Refresh error:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, refresh: false }));
    }
  };

  // Handle delete (soft delete)
  const handleDelete = async () => {
    if (!userToAction) return;

    const deleteToast = toast.loading("Deleting user...");

    try {
      const response = await fetch(
        `/api/admin/users/${userToAction.id}/delete`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: deleteReason }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      await onRefresh();
      setShowDeleteModal(false);
      setUserToAction(null);
      setDeleteReason("");

      toast.success(
        `User ${userToAction.name || userToAction.email} deleted successfully`,
        {
          id: deleteToast,
        }
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user", {
        id: deleteToast,
      });
    }
  };

  // Handle edit user (includes role changes)
  const handleEdit = async () => {
    if (!selectedUser) return;

    const editToast = toast.loading("Updating user...");

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update user");
      }

      const result = await response.json();

      await onRefresh();
      setShowEditModal(false);
      setSelectedUser(null);

      toast.success(result.message || "User updated successfully!", {
        id: editToast,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user", {
        id: editToast,
      });
    }
  };

  // Check if role change requires special handling
  const getRoleChangeMessage = (oldRole, newRole) => {
    if (oldRole === "STUDENT" && newRole === "ADMIN") {
      return "This will send an admin invite email to the user. They'll need to accept to become an ADMIN.";
    }
    if (oldRole === "ADMIN" && newRole === "STUDENT") {
      return "This will immediately demote the user to STUDENT. They'll lose admin privileges.";
    }
    if (newRole === "SUPER_ADMIN") {
      return "SUPER_ADMIN is a protected role. Only current SUPER_ADMIN can assign this role.";
    }
    return null;
  };

  // Calculate stats
  const activeUsers = users.filter((u) => !u.isDeleted).length;
  const deletedUsers = users.filter((u) => u.isDeleted).length;
  const adminCount = users.filter(
    (u) => u.role === "ADMIN" && !u.isDeleted
  ).length;
  const studentCount = users.filter(
    (u) => u.role === "STUDENT" && !u.isDeleted
  ).length;
  const superAdminCount = users.filter(
    (u) => u.role === "SUPER_ADMIN" && !u.isDeleted
  ).length;

  // Get role options based on current user role
  const getRoleOptions = (user) => {
    const baseOptions = [
      { value: "STUDENT", label: "STUDENT" },
      { value: "ADMIN", label: "ADMIN" },
    ];

    // Only show SUPER_ADMIN option if user is currently ADMIN
    if (user.role === "ADMIN") {
      baseOptions.push({
        value: "SUPER_ADMIN",
        label: "SUPER_ADMIN",
        disabled: user.id === currentUserId,
      });
    }

    return baseOptions;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-blue-900">All Users</h2>
          <p className="text-sm text-gray-600">
            Manage all platform users. Use Edit to change roles or details.
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button
            onClick={handleRefreshClick}
            disabled={isLoading.refresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                isLoading.refresh ? "animate-spin" : ""
              }`}
            />
            {isLoading.refresh ? "Refreshing..." : "Refresh"}
          </button>
          <div className="text-sm text-gray-500">
            {activeUsers} active • {deletedUsers} deleted
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Active Users</p>
          <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
          <div className="text-xs text-gray-500 mt-1">
            {studentCount} Students • {adminCount} Admins
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">SUPER_ADMIN</p>
          <p className="text-2xl font-bold text-purple-600">
            {superAdminCount}
          </p>
          <div className="text-xs text-gray-500 mt-1">Protected role</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Deleted Users</p>
          <p className="text-2xl font-bold text-red-600">{deletedUsers}</p>
          <div className="text-xs text-gray-500 mt-1">In recycle bin</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">ADMIN</p>
          <p className="text-2xl font-bold text-blue-600">{adminCount}</p>
          <div className="text-xs text-gray-500 mt-1">
            Can promote to SUPER_ADMIN
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Showing</p>
          <p className="text-2xl font-bold text-blue-600">
            {filteredUsers.length}
          </p>
          <div className="text-xs text-gray-500 mt-1">After filters</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center mb-3">
          <Filter className="h-4 w-4 text-gray-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700">Filter Users</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active Users</option>
              <option value="deleted">Deleted Users</option>
              <option value="all">All Users</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="ADMIN">Admins</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Level
            </label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Semester
            </label>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Semesters</option>
              <option value="First">First Semester</option>
              <option value="Second">Second Semester</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
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
                Academic
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {user.name || "No name"}
                        {user.id === currentUserId && (
                          <span className="ml-2 text-xs font-normal text-blue-600">
                            (You)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "SUPER_ADMIN"
                        ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
                        : user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role === "SUPER_ADMIN" && (
                      <Shield className="h-3 w-3 mr-1" />
                    )}
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {user.level && user.semester ? (
                    <>
                      Level {user.level}
                      <br />
                      <span className="text-gray-500">
                        {user.semester} Semester
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {user.isDeleted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="h-3 w-3 mr-1" />
                      Deleted
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-blue-600 hover:text-blue-900 inline-flex items-center px-2 py-1 hover:bg-blue-50 rounded"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  {/* Edit button - for all users */}
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowEditModal(true);
                    }}
                    className="text-yellow-600 hover:text-yellow-900 inline-flex items-center px-2 py-1 hover:bg-yellow-50 rounded"
                    title="Edit user"
                    disabled={user.isDeleted}
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  {/* Delete button - for non-SUPER_ADMIN users (except self) */}
                  {user.id !== currentUserId &&
                    user.role !== "SUPER_ADMIN" &&
                    !user.isDeleted && (
                      <button
                        onClick={() => {
                          setUserToAction(user);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 inline-flex items-center px-2 py-1 hover:bg-red-50 rounded"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Users Found
          </h3>
          <p className="text-gray-500 mb-4">
            Try changing your filters or check the Deleted Users tab.
          </p>
          <button
            onClick={() => {
              setFilterRole("all");
              setFilterLevel("all");
              setFilterSemester("all");
              setFilterStatus("active");
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <div>
          Showing {filteredUsers.length} of{" "}
          {filterStatus === "active"
            ? activeUsers
            : filterStatus === "deleted"
            ? deletedUsers
            : users.length}{" "}
          users
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs">
            Last updated:{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* ========== MODALS ========== */}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[28rem] shadow-xl">
            <h3 className="text-lg font-bold text-blue-900 mb-4">
              Delete User
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {userToAction.name || userToAction.email}
              </span>
              ?
              <br />
              <span className="text-red-600 font-medium">
                User will be moved to Deleted Users section and can be restored
                later.
              </span>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for deletion (optional):
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="e.g., Inactive account, duplicate, requested deletion..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToAction(null);
                  setDeleteReason("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading.delete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading.delete ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-[28rem] my-8 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-900">Edit User</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-700">
                  Editing:{" "}
                  <span className="font-medium">{selectedUser.email}</span>
                </p>
                {selectedUser.role !== editForm.role && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-700">
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      {getRoleChangeMessage(selectedUser.role, editForm.role)}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    value={editForm.level}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        level: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Level</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={editForm.semester}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        semester: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Semester</option>
                    <option value="First">First Semester</option>
                    <option value="Second">Second Semester</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Index Number
                </label>
                <input
                  type="text"
                  value={editForm.indexNo}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      indexNo: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., BS/MBB/23/0011"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={
                    selectedUser.role === "SUPER_ADMIN" ||
                    selectedUser.isDeleted
                  }
                >
                  {getRoleOptions(selectedUser).map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                      {option.disabled && " (Cannot self-assign)"}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <p className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    STUDENT → ADMIN: Sends invite email
                  </p>
                  <p className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    ADMIN → STUDENT: Immediate demotion
                  </p>
                  {selectedUser.role === "ADMIN" && (
                    <p className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full mr-2"></span>
                      ADMIN → SUPER_ADMIN: Immediate promotion
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={
                  isLoading.edit ||
                  (selectedUser.isDeleted &&
                    editForm.role !== selectedUser.role)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 inline-flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading.edit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Details Modal */}
      {selectedUser && !showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[28rem] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-900">User Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium">
                  {selectedUser.name || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Role</label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedUser.role === "SUPER_ADMIN"
                      ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
                      : selectedUser.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedUser.role}
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-500">
                  Academic Details
                </label>
                <p className="font-medium">
                  {selectedUser.level ? `Level ${selectedUser.level}` : "N/A"} •
                  {selectedUser.semester
                    ? ` ${selectedUser.semester} Semester`
                    : " N/A"}
                </p>
                {selectedUser.indexNo && (
                  <p className="text-sm text-gray-600">
                    Index: {selectedUser.indexNo}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedUser.isDeleted
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedUser.isDeleted ? "❌ Deleted" : "✅ Active"}
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-500">Joined</label>
                <p className="font-medium">
                  {new Date(selectedUser.createdAt).toLocaleDateString()} at{" "}
                  {new Date(selectedUser.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {selectedUser.isDeleted && selectedUser.deletedAt && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <label className="text-sm text-gray-500 font-medium">
                    Deletion Info
                  </label>
                  <p className="text-sm text-gray-700">
                    Deleted:{" "}
                    {new Date(selectedUser.deletedAt).toLocaleDateString()}
                  </p>
                  {selectedUser.deleteReason && (
                    <p className="text-sm text-gray-600 mt-1">
                      Reason: {selectedUser.deleteReason}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              {!selectedUser.isDeleted && (
                <button
                  onClick={() => {
                    setShowEditModal(true);
                  }}
                  className="px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50"
                >
                  <Edit className="h-4 w-4 inline mr-2" />
                  Edit User
                </button>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">Quick Actions Guide:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <h5 className="text-sm font-medium text-blue-700 mb-1">
              Role Management
            </h5>
            <ul className="text-xs text-blue-600 space-y-1">
              <li className="flex items-center">
                <Eye className="h-3 w-3 mr-2 text-blue-500" />
                <span>View: See user details</span>
              </li>
              <li className="flex items-center">
                <Edit className="h-3 w-3 mr-2 text-yellow-500" />
                <span>Edit: Modify details or change role</span>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-medium text-blue-700 mb-1">
              Filters & Status
            </h5>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Use filters to narrow down users</li>
              <li>
                • Click <span className="font-medium">Refresh</span> to update
                data
              </li>
              <li>• Deleted users can be restored from Deleted Users tab</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
