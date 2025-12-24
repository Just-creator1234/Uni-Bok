// /app/admin/team/TeamPageContent.js
"use client";

import { useState } from "react";
import CurrentAdminsSection from "./CurrentAdminsSection";
import SendInviteSection from "./SendInviteSection";
import PendingInvitesSection from "./PendingInvitesSection";
import InviteHistorySection from "./InviteHistorySection";

export default function TeamPageContent({ 
  admins, 
  pendingInvites, 
  inviteHistory,
  currentUserId 
}) {
  const [activeTab, setActiveTab] = useState("admins");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Team Management
        </h1>
        <p className="text-gray-600">
          Manage admin team members and send admin invites
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Admins</p>
          <p className="text-2xl font-bold text-blue-700">
            {admins.length}
          </p>
          <div className="text-xs text-gray-500 mt-1">
            {admins.filter(a => a.role === "SUPER_ADMIN").length} SUPER_ADMIN • 
            {admins.filter(a => a.role === "ADMIN").length} ADMIN
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Pending Invites</p>
          <p className="text-2xl font-bold text-yellow-600">
            {pendingInvites.length}
          </p>
          <div className="text-xs text-gray-500 mt-1">
            Active invitations
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Invites Sent</p>
          <p className="text-2xl font-bold text-green-600">
            {inviteHistory.length}
          </p>
          <div className="text-xs text-gray-500 mt-1">
            All-time invitations
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "admins", label: "Current Admins" },
            { id: "invite", label: "Send Invite" },
            { id: "pending", label: `Pending Invites (${pendingInvites.length})` },
            { id: "history", label: "Invite History" }
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

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {activeTab === "admins" && (
          <CurrentAdminsSection 
            admins={admins} 
            currentUserId={currentUserId}
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