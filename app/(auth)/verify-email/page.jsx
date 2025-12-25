"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [message, setMessage] = useState("Verifying your email...");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("❌ Invalid or missing token.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          const data = await res.json();
          setMessage(
            "✅ Email verified successfully! Please sign in to continue."
          );
          setIsVerified(true);
        } else {
          const data = await res.json();
          setMessage(`❌ ${data.error || "Verification failed."}`);
          setIsVerified(false);
        }
      } catch (error) {
        setMessage("❌ Something went wrong.");
        setIsVerified(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white px-6 py-10 rounded-xl shadow-lg w-[25rem] text-center"
      >
        <h1 className="text-2xl font-bold text-primary mb-4">
          Email Verification
        </h1>

        <div
          className={`px-4 py-3 rounded text-sm font-medium text-center space-y-4 ${
            isVerified
              ? "bg-green-50 text-green-700"
              : message.includes("❌")
              ? "bg-red-50 text-red-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          <p className="text-base">{message}</p>

          {isVerified ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Your email has been verified. You can now sign in to your
                account.
              </p>
              <Link
                href="/signin"
                className="inline-block w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors font-medium"
              >
                Go to Sign In
              </Link>
            </div>
          ) : message.includes("❌") ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                There was a problem verifying your email.
              </p>
              <div className="space-y-2">
                <Link
                  href="/signin"
                  className="inline-block w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  Try Signing In
                </Link>
                <Link
                  href="/signup"
                  className="inline-block w-full border border-primary text-primary py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors font-medium text-sm"
                >
                  Create New Account
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
