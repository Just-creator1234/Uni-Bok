// app/complete-profile/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  const [form, setForm] = useState({
    level: "",
    semester: "",
    indexNo: "",
    hasRegistered: false,
  });

  // Check auth and get user info on mount
  useEffect(() => {
    fetch("/api/auth/status")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated || data.status === "complete") {
          router.push(data.redirectTo || "/signin");
        } else {
          setUserEmail(data.user?.email || "");
          setUserName(data.user?.name || "");
          setLoading(false);
        }
      })
      .catch(() => router.push("/signin"));
  }, [router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/user/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: form.level,
          semester: form.semester,
          indexNo: form.indexNo,
          hasRegistered: form.hasRegistered,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to complete profile");
      }

      // Get updated status and redirect
      const statusRes = await fetch("/api/auth/status");
      const status = await statusRes.json();

      router.push(status.redirectTo || "/Allcourse");
    } catch (error) {
      alert(error.message || "There was an error completing your profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-secondary">
      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center px-10 py-16 bg-gradient-to-br from-blue-300 to-primary text-white space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Welcome to Uni-bok!
          </h1>
          <p className="text-lg text-blue-100 mb-2">
            Almost there, {userName || "new student"}!
          </p>
          <p className="text-blue-100 text-base mb-6">
            Complete your profile to access course materials
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Google Account Connected</p>
                <p className="text-sm text-blue-200">Email: {userEmail}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-medium">2</span>
              </div>
              <div>
                <p className="font-medium">Academic Information</p>
                <p className="text-sm text-blue-200">
                  Tell us your level and semester
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-medium">3</span>
              </div>
              <div>
                <p className="font-medium">Personalized Access</p>
                <p className="text-sm text-blue-200">
                  Get your course materials
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg w-full  mx-4"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-heading">
                Complete Your Profile
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Tell us about your academic details
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Level */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Current Level
                </label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Level</option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                </select>
              </div>

              {/* Semester */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Current Semester
                </label>
                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Semester</option>
                  <option value="First">First Semester</option>
                  <option value="Second">Second Semester</option>
                </select>
              </div>

              {/* Index Number */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Index Number
                </label>
                <input
                  type="text"
                  name="indexNo"
                  value={form.indexNo}
                  onChange={handleChange}
                  placeholder="Enter your index number"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Registration Checkbox */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  id="hasRegistered"
                  name="hasRegistered"
                  checked={form.hasRegistered}
                  onChange={handleChange}
                  className="mt-1 accent-primary h-4 w-4"
                />
                <div>
                  <label
                    htmlFor="hasRegistered"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Course Registration Confirmation
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    I have registered my courses with the university for this
                    semester
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Completing Profile...
                  </span>
                ) : (
                  "Complete Profile & Continue"
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                By continuing, you agree to Uni-bok's{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
