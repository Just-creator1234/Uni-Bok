"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary px-4 sm:px-6">
      <motion.div
        className="text-center "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-6 w-12 h-12 sm:w-14 sm:h-14 text-blue-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        >
          {/* SVG paths */}
          <path d="m10 16 1.5 1.5" />
          <path d="m14 8-1.5-1.5" />
          <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
          <path d="m16.5 10.5 1 1" />
          <path d="m17 6-2.891-2.891" />
          <path d="M2 15c6.667-6 13.333 0 20-6" />
          <path d="m20 9 .891.891" />
          <path d="M3.109 14.109 4 15" />
          <path d="m6.5 12.5 1 1" />
          <path d="m7 18 2.891 2.891" />
          <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
        </motion.svg>

        <motion.h1
          className="text-2xl sm:text-4xl font-semibold text-blue-700 mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Welcome to Uni-Bok
        </motion.h1>

        <motion.p
          className="text-sm sm:text-base text-gray-700 mx-auto mb-6 px-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          A project by Darlington Boateng Oppong, unpaid as of today, by the
          Department of Molecular Biology and Biotechnology. Your ultimate
          learning companion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            href="/signup"
            className="inline-block border-2 border-accent  text-secondary font-semibold px-6 py-3 rounded-lg transition "
          >
            Get Started
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
