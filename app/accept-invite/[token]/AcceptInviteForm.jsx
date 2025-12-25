// /app/accept-invite/[token]/AcceptInviteForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function AcceptInviteForm({ invite, token }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!invite.userExists) {
      if (!formData.name.trim()) {
        setError("Name is required");
        return;
      }
      if (!formData.password) {
        setError("Password is required");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/accept/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to accept invite");
      }

      setSuccess(data.message);
      
      // Redirect to signin after 3 seconds
      setTimeout(() => {
        router.push("/signin");
      }, 3000);

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Invitation</h1>
          <p className="text-gray-600 mt-2">
            You're invited to become an administrator for Uni-bok
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium mb-2">Invitation Details:</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Email: {invite.email}</li>
            <li>• Role: {invite.role}</li>
            <li>• Expires: {new Date(invite.expires).toLocaleDateString()}</li>
            {invite.userExists && (
              <li className="font-medium">✓ You already have an account</li>
            )}
          </ul>
        </div>

        {invite.userExists ? (
          <div className="text-center">
            <p className="text-gray-700 mb-6">
              Click the button below to accept the admin role for your existing account.
            </p>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 disabled:opacity-50"
            >
              {isLoading ? "Accepting..." : "Accept Admin Role"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Create a password (min. 6 characters)"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Admin Account"}
            </button>
          </form>
        )}

        {error && (
          <div className="mt-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{success}</p>
            <p className="text-sm text-gray-600 mt-2">
              Redirecting to signin page...
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          By accepting this invitation, you agree to the administrator responsibilities.
        </p>
      </div>
    </div>
  );
}