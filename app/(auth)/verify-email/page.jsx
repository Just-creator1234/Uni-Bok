"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [message, setMessage] = useState("Verifying your email...");

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

        // In your verify page component
        if (res.ok) {
          const data = await res.json();
          setMessage("✅ Email verified! Redirecting to questionnaire...");
          setTimeout(() => {
            // Pass the userId to the questionnaire page
            router.push(`/questionnaire?userId=${data.userId}`);
          }, 2500);
        } else {
          const data = await res.json();
          setMessage(`❌ ${data.error || "Verification failed."}`);
        }
      } catch (error) {
        setMessage("❌ Something went wrong.");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white px-6 py-10 rounded-xl shadow-lg  w-[25rem] text-center"
      >
        <h1 className="text-2xl font-bold text-primary mb-4">
          Email Verification
        </h1>

        <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded text-sm font-medium text-center space-y-2">
          <p>{message}</p>

          {/* Show retry link only if the message contains an error (optional logic) */}
          {message.toLowerCase().includes("invalid") ||
          message.toLowerCase().includes("expired") ? (
            <a
              href="/signup"
              className="text-blue-600 underline hover:text-blue-800 text-sm inline-block"
            >
              Please try again
            </a>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
