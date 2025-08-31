// app/auth/link-account/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LinkAccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [isLinking, setIsLinking] = useState(false);

  const handleLinkAccount = async () => {
    setIsLinking(true);
    await signIn("google", { callbackUrl: "/Allcourse" });
  };

  const handleUsePassword = () => {
    router.push(`/signin?email=${encodeURIComponent(email)}`);
  };

  if (!email) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLinking ? "Linking..." : "Link Google Account"}
          </button>

          <button
            onClick={handleUsePassword}
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
          >
            Use Password Instead
          </button>
        </div>
      </div>
    </div>
  );
}
