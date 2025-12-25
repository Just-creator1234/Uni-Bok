// /app/admin/team/SendInviteSection.js
"use client";

import { useState } from "react";
import { Send, Mail, AlertCircle } from "lucide-react";

export default function SendInviteSection({ onInviteSent }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invite");
      }

      setSuccess(`Invite sent successfully to ${email}`);
      setEmail("");
      onInviteSent();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-900">Send Admin Invite</h2>
        <p className="text-sm text-gray-600">
          Invite someone to become an admin. They'll receive an email with instructions.
        </p>
      </div>

      <div className="">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              For existing users: Role will be updated to ADMIN immediately.
              <br />
              For new users: They'll sign up with ADMIN role pre-assigned.
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <Send className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{success}</p>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? "Sending..." : "Send Invite"}
            </button>
            <button
              type="button"
              onClick={() => setEmail("")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Important Notes:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Invites expire in 24 hours</li>
            <li>• Cannot invite existing ADMINS or SUPER_ADMIN</li>
            <li>• Email will be sent immediately</li>
            <li>• Check "Pending Invites" tab to manage sent invites</li>
          </ul>
        </div>
      </div>
    </div>
  );
}