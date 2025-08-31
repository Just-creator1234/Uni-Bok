"use client";

import { motion } from "framer-motion";


export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
      >
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

      <motion.span
        className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-blue-500 to-blue-800 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Uni<span className="text-primary">-bok</span>
      </motion.span>

      <motion.p
        className="text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.6,
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1,
        }}
      >
        Loading...
      </motion.p>
    </div>
  );
}
