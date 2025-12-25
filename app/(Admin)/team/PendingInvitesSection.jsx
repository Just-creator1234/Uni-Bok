// /app/admin/team/PendingInvitesSection.js
"use client";

import { useState } from "react";
import { Clock, Mail, RefreshCw, X, AlertTriangle } from "lucide-react";

export default function PendingInvitesSection({ invites, onRefresh }) {
  const [isLoading, setIsLoading] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [inviteToCancel, setInviteToCancel] = useState(null);

  const calculateTimeLeft = (expires) => {
    const now = new Date();
    const expiry = new Date(expires);
    const diff = expiry - now;
    
    if (diff <= 0) return "Expired";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m left`;
  };

  const handleResend = async (inviteId) => {
    setIsLoading(prev => ({ ...prev, [inviteId]: true }));
    
    try {
      const response = await fetch(`/api/admin/invite/${inviteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Failed to resend invite");
      
      onRefresh();
    } catch (error) {
      console.error("Error resending invite:", error);
      alert("Failed to resend invite. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, [inviteId]: false }));
    }
  };

  const handleCancel = async () => {
    if (!inviteToCancel) return;
    
    setIsLoading(prev => ({ ...prev, [inviteToCancel.id]: true }));
    
    try {
      const response = await fetch(`/api/admin/invite/${inviteToCancel.id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to cancel invite");
      
      onRefresh();
      setShowCancelModal(false);
      setInviteToCancel(null);
    } catch (error) {
      console.error("Error cancelling invite:", error);
      alert("Failed to cancel invite. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, [inviteToCancel.id]: false }));
    }
  };

  if (invites.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Invites</h3>
        <p className="text-gray-500">All invites have been accepted or expired.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-blue-900">Pending Invites</h2>
          <p className="text-sm text-gray-600">
            Invites that haven't been accepted yet (expire in 24 hours)
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {invites.length} pending {invites.length === 1 ? "invite" : "invites"}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sent
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires In
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
            {invites.map((invite) => {
              const timeLeft = calculateTimeLeft(invite.expires);
              const isExpiringSoon = timeLeft.includes("h") && parseInt(timeLeft) < 6;
              
              return (
                <tr key={invite.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium">{invite.email}</span>
                    </div>
                    {/* FIXED: Change invite.user to invite.invitedByUser */}
                    {invite.invitedByUser && (
                      <p className="text-xs text-gray-500 mt-1">
                        Invited by: {invite.invitedByUser.name || invite.invitedByUser.email}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invite.createdAt).toLocaleDateString()}
                    <br />
                    <span className="text-gray-500 text-xs">
                      {new Date(invite.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className={`h-4 w-4 mr-2 ${
                        isExpiringSoon ? "text-orange-500" : "text-gray-400"
                      }`} />
                      <span className={isExpiringSoon ? "text-orange-600 font-medium" : ""}>
                        {timeLeft}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⏳ Pending
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleResend(invite.id)}
                      disabled={isLoading[invite.id]}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center disabled:opacity-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      {isLoading[invite.id] ? "Resending..." : "Resend"}
                    </button>
                    <button
                      onClick={() => {
                        setInviteToCancel(invite);
                        setShowCancelModal(true);
                      }}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && inviteToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[28rem] shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-bold text-blue-900">
                Cancel Invite
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel the invite to <span className="font-semibold">{inviteToCancel.email}</span>?
              <br />
              <span className="text-red-600 font-medium">
                This cannot be undone. The user will not be able to accept this invite.
              </span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setInviteToCancel(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Keep Invite
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading[inviteToCancel.id]}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading[inviteToCancel.id] ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}