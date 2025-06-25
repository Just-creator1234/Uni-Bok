"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignoutAfterDelete() {
  useEffect(() => {
    signOut({ callbackUrl: "/signup" });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow text-center w-[25rem">
        <h2 className="text-blue-800 font-semibold text-lg mb-2">
          Signing you out...
        </h2>
        <p className="text-sm text-gray-600">
          Please wait while we redirect you to signup.
        </p>
      </div>
    </div>
  );
}
