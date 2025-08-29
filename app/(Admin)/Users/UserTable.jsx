"use client";

import { useState, useTransition } from "react";
import UserInsights from "./UserInsights";
import * as XLSX from "xlsx";
import { deleteStudent, updateUserProfile } from "@/app/actions/editUser";

export default function UserTable({ users }) {
  const [filterRegistered, setFilterRegistered] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    indexNo: "",
    level: "",
    semester: "",
    role: "STUDENT",
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    startTransition(async () => {
      await updateUserProfile(editUser.id, editForm);
      setEditUser(null);
      window.location.reload();
    });
  };
  const filteredUsers = users.filter((user) => {
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.indexNo?.toLowerCase().includes(query);

    const matchesLevel = filterLevel ? user.level === filterLevel : true;
    const matchesSemester = filterSemester
      ? user.semester === filterSemester
      : true;
    const matchesRegistered =
      filterRegistered === ""
        ? true
        : String(user.hasRegistered) === filterRegistered;

    const matchesRole = filterRole === "" ? true : user.role === filterRole;

    return (
      matchesSearch &&
      matchesLevel &&
      matchesSemester &&
      matchesRegistered &&
      matchesRole
    );
  });

  const handleDelete = () => {
    if (!userToDelete) return;
    startTransition(async () => {
      await deleteStudent(userToDelete.id);
      window.location.reload();
    });
  };

  const exportToCSV = (data, filename = "users.csv") => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportFiltered = () => {
    const data = filteredUsers.map(
      ({ name, email, indexNo, level, semester }) => ({
        Name: name,
        Email: email,
        "Index No": indexNo || "-",
        Level: level,
        Semester: semester,
      })
    );
    exportToCSV(data, "filtered_users.csv");
  };

  const handleExportAll = () => {
    const data = users.map(({ name, email, indexNo, level, semester }) => ({
      Name: name,
      Email: email,
      "Index No": indexNo || "-",
      Level: level,
      Semester: semester,
    }));
    exportToCSV(data, "all_users.csv");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">
        Registered Students
      </h1>

      <div className="flex gap-3 justify-end mb-4">
        <button
          onClick={handleExportFiltered}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Export Filtered
        </button>
        <button
          onClick={handleExportAll}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          Export All
        </button>
      </div>

      <UserInsights users={users} />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        >
          <option value="">All Levels</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
        </select>

        <select
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        >
          <option value="">All Semesters</option>
          <option value="First">First</option>
          <option value="Second">Second</option>
        </select>

        <select
          value={filterRegistered}
          onChange={(e) => setFilterRegistered(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        >
          <option value="">All Students</option>
          <option value="true">Registered with University</option>
          <option value="false">Not Registered</option>
        </select>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, or index number..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/2 border border-gray-300 px-4 py-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Table */}
      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="min-w-full text-sm text-left bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow">
          <thead className="bg-blue-50 text-blue-800">
            <tr>
              <th className="px-4 py-3 border border-gray-200 font-medium">
                Name
              </th>
              <th className="px-4 py-3 border border-gray-200 font-medium">
                Email
              </th>
              <th className="px-4 py-3 border border-gray-200 font-medium">
                Index No
              </th>
              <th className="px-4 py-3 border border-gray-200 font-medium">
                Level
              </th>
              <th className="px-4 py-3 border border-gray-200 font-medium">
                Semester
              </th>
              <th className="px-4 py-3 border border-gray-200 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 text-gray-700">
                <td className="px-4 py-3 border">{user.name}</td>
                <td className="px-4 py-3 border">{user.email}</td>
                <td className="px-4 py-3 border">{user.indexNo || "—"}</td>
                <td className="px-4 py-3 border">{user.level}</td>
                <td className="px-4 py-3 border">{user.semester}</td>
                <td className="px-4 py-3 border space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      setUserToDelete(user);
                      setShowConfirm(true);
                    }}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setEditUser(user);
                      setEditForm({
                        name: user.name || "",
                        indexNo: user.indexNo || "",
                        level: user.level || "",
                        semester: user.semester || "",
                        role: user.role || "",
                      });
                    }}
                    className="text-yellow-600 hover:underline text-xs"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-400 italic mb-2 block md:hidden text-center">
        Btter viewon on Pc. Swipe left/right to see more columns →
      </div>
      {showConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[25rem] shadow-lg">
            <h2 className="text-lg font-bold text-blue-900 mb-3">
              Confirm Account Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to permanently delete
              <span className="font-semibold"> {userToDelete.name}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              >
                {isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[25rem] shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-blue-900">
              Edit Student
            </h2>
            <div className="space-y-3">
              <input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                placeholder="Name"
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="indexNo"
                value={editForm.indexNo}
                onChange={handleEditChange}
                placeholder="Index Number"
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="level"
                value={editForm.level}
                onChange={handleEditChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Level</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
              </select>
              <select
                name="semester"
                value={editForm.semester}
                onChange={handleEditChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Semester</option>
                <option value="First">First</option>
                <option value="Second">Second</option>
              </select>
              <select
                name="role"
                value={editForm.role}
                onChange={handleEditChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditUser(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[25rem] shadow-xl border border-blue-100">
            <div className="text-xl font-semibold  mb-4 text-center text-primary">
              Student Details
            </div>

            <ul className="text-sm space-y-3 text-gray-700">
              <li>
                <span className="font-medium text-blue-800">Name:</span>{" "}
                {selectedUser.name}
              </li>
              <li>
                <span className="font-medium text-blue-800">Email:</span>{" "}
                {selectedUser.email}
              </li>
              <li>
                <span className="font-medium text-blue-800">Index No:</span>{" "}
                {selectedUser.indexNo || "—"}
              </li>
              <li>
                <span className="font-medium text-blue-800">Level:</span>{" "}
                {selectedUser.level}
              </li>
              <li>
                <span className="font-medium text-blue-800">Semester:</span>{" "}
                {selectedUser.semester}
              </li>
              <li>
                <span className="font-medium text-blue-800">Joined:</span>{" "}
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </li>
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition"
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
