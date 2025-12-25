// /app/admin/team/InviteHistorySection.js
"use client";

import {
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  User,
} from "lucide-react";
import * as XLSX from "xlsx";

export default function InviteHistorySection({ history }) {
  const exportToCSV = () => {
    const data = history.map((invite) => ({
      Email: invite.email,
      "Invited By": invite.invitedByUser?.name || "System",
      "Invited By Email": invite.invitedByUser?.email || "—",
      "Sent Date": new Date(invite.createdAt).toLocaleDateString(),
      "Sent Time": new Date(invite.createdAt).toLocaleTimeString(),
      "Expiry Date": new Date(invite.expires).toLocaleDateString(),
      Status: invite.used
        ? "Accepted"
        : new Date(invite.expires) < new Date()
        ? "Expired"
        : "Pending",
      "Accepted Date": invite.usedAt
        ? new Date(invite.usedAt).toLocaleDateString()
        : "—",
      "Accepted Time": invite.usedAt
        ? new Date(invite.usedAt).toLocaleTimeString()
        : "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "admin_invites_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (invite) => {
    if (invite.used) {
      return {
        label: "✅ Accepted",
        className: "bg-green-100 text-green-800",
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
      };
    }

    if (new Date(invite.expires) < new Date()) {
      return {
        label: "❌ Expired",
        className: "bg-gray-100 text-gray-800",
        icon: <XCircle className="h-3 w-3 mr-1" />,
      };
    }

    return {
      label: "⏳ Pending",
      className: "bg-yellow-100 text-yellow-800",
      icon: <Clock className="h-3 w-3 mr-1" />,
    };
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Invite History
        </h3>
        <p className="text-gray-500">No invites have been sent yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-blue-900">Invite History</h2>
          <p className="text-sm text-gray-600">
            Record of all admin invitations sent
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sent Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accepted Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invited By
              </th>{" "}
              {/* CHANGED: From "User" to "Invited By" */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((invite) => {
              const status = getStatusBadge(invite);

              return (
                <tr key={invite.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium">{invite.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invite.createdAt).toLocaleDateString()}
                    <br />
                    <span className="text-gray-500 text-xs">
                      {new Date(invite.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {invite.usedAt ? (
                      <>
                        {new Date(invite.usedAt).toLocaleDateString()}
                        <br />
                        <span className="text-gray-500 text-xs">
                          {new Date(invite.usedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {invite.invitedByUser ? (
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium">
                            {invite.invitedByUser.name || "No name"}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {invite.invitedByUser.email}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <div>
          Showing {history.length} {history.length === 1 ? "invite" : "invites"}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center">
              <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
              Accepted
            </span>
            <span className="inline-flex items-center">
              <Clock className="h-3 w-3 text-yellow-600 mr-1" />
              Pending
            </span>
            <span className="inline-flex items-center">
              <XCircle className="h-3 w-3 text-gray-600 mr-1" />
              Expired
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
