"use client";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setVerified(
        "If an account with that email exists, we've sent a reset link."
      );
    } catch (err) {
      setVerified("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <div className="w-[25rem] bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-center text-blue-800 mb-4">
          Reset Your Password 🔐
        </h1>

        {verified && (
          <p className="p-3 text-sm text-yellow-800 bg-yellow-100 rounded-md text-center mb-4">
            {verified}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition disabled:opacity-70"
          >
            {loading ? "Processing..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
