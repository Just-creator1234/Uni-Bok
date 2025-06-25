"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Featurelist from "../Featurelist";
import { TypingEffect } from "../TypingEffect";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage({ user }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  async function handleSubmition(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      remember,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      if (!user?.hasCompletedQuestionnaire) {
        router.push("/questionnaire");
      } else {
        router.push("/Allcourse");
      }
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[3fr_2fr] bg-secondary">
      {/* LEFT SIDE */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-300 to-primary px-10 shadow-accent rounded-r-4xl">
        <div className="space-y-6 text-heading">
          <TypingEffect text="Welcome Back to Uni-bok" />

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

          <Featurelist />
        </div>
      </div>

      {/* RIGHT SIDE - SIGN IN FORM */}

      <div className="w-full bg-secondary min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 bg-white rounded-xl shadow-lg w-[25rem]  space-y-5"
        >
          <h2 className="text-center text-2xl font-bold text-heading">
            Welcome Back
          </h2>

          {error && (
            <p className="w-full rounded-md bg-red-100 text-red-700 text-center p-2 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmition} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-sm text-muted-foreground max-sm:flex-col gap-3 ">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-primary "
                />
                Remember Me
              </label>

              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn w-full h-12 text-base ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <button
            className="w-full flex items-center justify-center gap-2 bg-white border border-muted p-2 rounded-md hover:bg-muted transition"
            onClick={() => {
              signIn("google");
            }}
          >
            <img src="/google.svg" alt="Google icon" className="w-5 h-5" />
            <span className="text-sm font-medium text-heading">
              Sign In With Google
            </span>
          </button>

          <p className="text-center text-sm text-muted-foreground pt-2">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
