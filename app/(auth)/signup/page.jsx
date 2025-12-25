"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TypingEffect } from "../TypingEffect";
import Featurelist from "../Featurelist";
import { CheckCircle, Mail } from "lucide-react";
import { signIn } from "next-auth/react";

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
      <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-8">
        {hasMounted ? (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[27rem] bg-white rounded-xl shadow-lg p-8 sm:p-10"
          >
            {!isSuccess ? (
              <>
                <div className="text-center space-y-1">
                  <h2 className="text-3xl font-bold text-heading">
                    Create Account
                  </h2>
                  <p className="text-sm">
                    Join Uni-bok to access all materials
                  </p>
                </div>
                {error && (
                  <p className="p-2 bg-red-100 text-sm text-red-700 text-center rounded-md mt-4">
                    {error}
                  </p>
                )}
                {verified && (
                  <p className="p-2 bg-yellow-100 text-sm text-yellow-700 text-center rounded-md mt-4">
                    {verified}
                  </p>
                )}

                <button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      // Google sign-up: Immediate access
                      await signIn("google", {
                        callbackUrl: "/Allcourse", // Direct to Allcourse
                      });
                    } catch (error) {
                      setError("Failed to start Google sign-up");
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-muted p-2 rounded-md hover:bg-muted transition"
                >
                  <img
                    src="/google.svg"
                    alt="Google icon"
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium text-heading">
                    {loading
                      ? "Connecting to Google..."
                      : "Sign Up With Google"}
                  </span>
                </button>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted-dark"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white">Sign up with email</span>
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
                <p className="text-center text-sm pt-4">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign In
                  </Link>
                </p>
              </>
            ) : (
              // SUCCESS MESSAGE SECTION - NO SCROLL
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full space-y-6"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>

                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold text-heading">
                      Almost There!
                    </h2>
                    <p className="text-base text-gray-700">
                      Welcome to Uni-bok,{" "}
                      <span className="font-semibold">{name}</span>!
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm text-blue-800">
                        Check Your Email to Complete Sign Up
                      </h3>
                      <p className="text-sm text-blue-700">
                        We've sent a verification email to{" "}
                        <span className="font-semibold">{email}</span>.
                        <br />
                        <span className="font-medium">
                          You must verify your email before you can sign in.
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-sm text-amber-800 mb-1.5">
                      Important:
                    </h4>
                    <ul className="text-amber-700 space-y-1 text-xs">
                      <li>• The verification link expires in 24 hours</li>
                      <li>
                        • Check your spam folder if you don't see the email
                      </li>
                      <li>
                        • Use the same email to sign in after verification
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      Verified your email already?
                    </p>
                    <Link
                      href="/signin"
                      className="inline-block btn w-full h-12 text-base"
                    >
                      Proceed to Sign In
                    </Link>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      Need help?{" "}
                      <Link
                        href="/contact"
                        className="text-primary font-medium hover:underline"
                      >
                        Contact Support
                      </Link>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
