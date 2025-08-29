"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { TypingEffect } from "../TypingEffect";
import Featurelist from "../Featurelist";
import { CheckCircle } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Account Creation Failed");
      setVerified(data.message);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-secondary overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden md:flex items-center justify-center px-10 shadow-accent rounded-r-4xl bg-gradient-to-br from-blue-300 to-primary">
        <div className="space-y-6">
          <TypingEffect text="Welcome to Uni-bok" />
          {hasMounted && (
            <>
              <motion.p
                className="text-lg text-blue-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.8 }}
              >
                By the Department of Molecular Biology and Biotechnology
              </motion.p>
              <motion.p
                className="text-sm text-blue-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.2, duration: 0.8 }}
              >
                Access your course materials, assignments, and more — all in one
                place.
              </motion.p>
            </>
          )}
          <Featurelist />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
        {hasMounted ? (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-[27rem] bg-white rounded-xl shadow-lg p-8 sm:p-10 space-y-6"
          >
            {!isSuccess ? (
              <>
                <div className="text-center space-y-1">
                  <h2 className="text-3xl font-bold text-heading">
                    Create Account
                  </h2>
                  <p className="text-sm">Join Uni-bok to access all materials</p>
                </div>

                {error && (
                  <p className="p-2 bg-red-100 text-sm text-red-700 text-center rounded-md">
                    {error}
                  </p>
                )}
                {verified && (
                  <p className="p-2 bg-yellow-100 text-sm text-yellow-700 text-center rounded-md">
                    {verified}
                  </p>
                )}

                <button
                  className="w-full flex items-center justify-center gap-2 bg-white border border-muted p-2 rounded-md hover:bg-muted transition"
                  onClick={() => signIn("google")}
                >
                  <img src="/google.svg" alt="Google icon" className="w-5 h-5" />
                  <span className="text-sm font-medium text-heading">
                    Sign In With Google
                  </span>
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted-dark"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn w-full h-12 text-base"
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                  </button>
                </form>

                <p className="text-center text-sm pt-2">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign In
                  </Link>
                </p>
              </>
            ) : (
              // SUCCESS MESSAGE SECTION
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6 py-4"
              >
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-heading">
                    Account Created Successfully!
                  </h2>
                  <p className="text-sm text-gray-600">
                    Welcome to Uni-bok, {name}!
                  </p>
                  <p className="text-sm text-gray-600">
                    A verification email has been sent to <strong>{email}</strong>.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">What's next?</h3>
                  <ul className="text-sm text-blue-700 space-y-1 text-left">
                    <li>• Check your email to verify your account</li>
                    <li>• Explore your student dashboard</li>
                    <li>• Access course materials and assignments</li>
                    <li>• Update your profile information</li>
                  </ul>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => signIn()}
                    className="btn w-full h-12 text-base"
                  >
                    Sign In to Your Account
                  </button>
                  <p className="text-sm text-gray-600">
                    Didn't receive the email?{" "}
                    <button className="text-primary hover:underline">
                      Resend verification
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}