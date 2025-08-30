"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LinkAccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const errorParam = searchParams.get("error"); // Renamed
  const [isLinking, setIsLinking] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (errorParam) {
      setMessage("An error occurred during account linking. Please try again.");
    }
  }, [errorParam]);

  const handleLinkAccount = async () => {
    setIsLinking(true);
    await signIn("google", { callbackUrl: "/My-blogs" });
  };

  const handleUsePassword = () => {
    router.push(`/signin?email=${encodeURIComponent(email)}`);
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p>Invalid request. Please try signing in again.</p>
          <Link href="/signin" className="text-blue-600 hover:underline">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Account Already Exists
        </h1>

        <p className="text-gray-600 mb-6">
          An account with <strong>{email}</strong> already exists. Would you
          like to:
        </p>

        <div className="space-y-4">
          <button
            onClick={handleLinkAccount}
            disabled={isLinking}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLinking ? "Linking..." : "Link Google Account"}
          </button>

          <button
            onClick={handleUsePassword}
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Use Password Instead
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Linking accounts allows you to sign in with either method in the
          future.
        </p>

        {message && <p className="text-red-600 text-sm mt-4">{message}</p>}
      </motion.div>
    </div>
  );
}
