"use client";

import { motion } from "framer-motion";

const features = [
  "Browse all departmental courses",
  "Access course materials (PDF, PPTX, DOCX)",
  "Read materials in-app",
  "View by topic and semester",
  "Register & track student profile",
  "Secure login and email verification",
  "Smart quiz generation (coming soon!)",
];

export default function FeatureList() {
  return (
    <div className="mt-8 space-y-4 ">
      {features.map((item, index) => (
        <motion.div
          key={index}
          className="text-sm text-white/80 pl-3 border-l-2 border-white/40"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3.8 + index * 0.2, duration: 0.5 }}
        >
          • {item}
        </motion.div>
      ))}
    </div>
  );
}
