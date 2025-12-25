// /app/admin/team/TeamPageContent.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AllUsersSection from "./AllUsersSection"; // Changed from CurrentAdminsSection
import SendInviteSection from "./SendInviteSection";
import PendingInvitesSection from "./PendingInvitesSection";
import InviteHistorySection from "./InviteHistorySection";
import DeletedUsersSection from "./DeletedUsersSection";

export default function TeamPageContent({
  allUsers, // New prop
  admins, // Keep for stats
  pendingInvites,
  inviteHistory,
  currentUserId,
  deletedUsers,
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all-users"); // Changed default tab
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    // This will re-fetch all server components in the current route
    router.refresh();
  };

  // Calculate stats
  const activeUsers = allUsers.filter((u) => !u.isDeleted).length;
  const totalDeleted = deletedUsers.length;
  const adminCount = admins.filter((u) => !u.isDeleted).length;
  const studentCount = allUsers.filter(
    (u) => u.role === "STUDENT" && !u.isDeleted
  ).length;
  const superAdminCount = allUsers.filter(
    (u) => u.role === "SUPER_ADMIN" && !u.isDeleted
  ).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          User & Team Management
        </h1>
        <p className="text-gray-600">
          Manage all platform users, admins, and team invites
        </p>
      </div>

      {/* Quick Stats - Updated with all users */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Active Users</p>
          <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
          <div className="text-xs text-gray-500 mt-1">
            {studentCount} Students • {adminCount} Admins
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="text-2xl font-bold text-blue-700">{adminCount}</p>
          <div className="text-xs text-gray-500 mt-1">
            {superAdminCount} SUPER_ADMIN • {adminCount - superAdminCount} ADMIN
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Deleted Users</p>
          <p className="text-2xl font-bold text-red-600">{totalDeleted}</p>
          <div className="text-xs text-gray-500 mt-1">
            Can be restored or purged
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Pending Invites</p>
          <p className="text-2xl font-bold text-yellow-600">
            {pendingInvites.length}
          </p>
          <div className="text-xs text-gray-500 mt-1">Active invitations</div>
        </div>
      </div>

      {/* Tabs - Updated with "All Users" tab */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "all-users", label: `All Users (${activeUsers})` },
            { id: "deleted", label: `Deleted Users (${deletedUsers.length})` },
            { id: "invite", label: "Send Invite" },
            {
              id: "pending",
              label: `Pending Invites (${pendingInvites.length})`,
            },
            { id: "history", label: "Invite History" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content - Updated with AllUsersSection */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {activeTab === "all-users" && (
          <AllUsersSection
            users={allUsers}
            currentUserId={currentUserId}
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === "deleted" && (
          <DeletedUsersSection
            deletedUsers={deletedUsers}
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === "invite" && (
          <SendInviteSection onInviteSent={handleRefresh} />
        )}

        {activeTab === "pending" && (
          <PendingInvitesSection
            invites={pendingInvites}
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === "history" && (
          <InviteHistorySection history={inviteHistory} />
        )}
      </div>
    </div>
  );
}
