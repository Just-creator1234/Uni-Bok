// app/questionnaire/Form.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Questionnaire() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    level: "",
    semester: "",
    indexNo: "",
    hasRegistered: false,
  });

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
      // Submit to questionnaire API endpoint
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
        throw new Error(error.error || "Failed to submit questionnaire");
      } else {
        router.push("/Allcourse");
      }

      // Fallback redirect
    } catch (error) {
      console.error("Questionnaire submission error:", error);
      alert(
        error.message ||
          "There was an error completing your registration. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      key="questionnaire"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-secondary">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex flex-col justify-center px-10 py-16 bg-gradient-to-br from-blue-300 to-primary text-white space-y-4 shadow-accent rounded-r-4xl"
        >
          <h1 className="text-4xl font-bold leading-tight">Almost there!</h1>
          <p className="text-blue-100 text-base">
            Just a few more details to personalize your experience on Uni-bok.
          </p>
          <ul className="text-sm text-blue-200 space-y-2 list-disc list-inside">
            <li>📘 Tailored course materials for your level</li>
            <li>🧬 Organized by semester and topic</li>
            <li>🔒 Secure student dashboard</li>
          </ul>
        </motion.div>

        {/* Form Section */}
        <div className="flex items-center justify-center px-4 py-12">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "tween", duration: 0.5 }}
            className="bg-white p-8 sm:p-10 rounded-xl shadow-lg w-[29rem] space-y-6"
          >
            <h2 className="text-2xl font-bold text-center text-heading">
              Complete Your Registration
            </h2>

            <div>
              <label className="block mb-1 text-sm font-medium">Level</label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                required
                className="w-full border border-muted rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Level</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Semester</label>
              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
                required
                className="w-full border border-muted rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Semester</option>
                <option value="First">First</option>
                <option value="Second">Second</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Index Number
              </label>
              <input
                name="indexNo"
                value={form.indexNo}
                placeholder="Enter your index number"
                onChange={handleChange}
                required
                className="w-full border border-muted rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* ✅ Registration Confirmation Checkbox */}
            <div className="flex items-center gap-2 w-full">
              <input
                type="checkbox"
                name="hasRegistered"
                checked={form.hasRegistered}
                onChange={handleChange}
                className="accent-blue-600 h-4 w-4"
              />
              <label htmlFor="hasRegistered" className="text-sm text-gray-700">
                Have you registered your courses with the university?
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn w-full h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Finish Registration"}
            </button>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
}
