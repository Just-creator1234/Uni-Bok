"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function UserInsights({ users }) {
  const [open, setOpen] = useState(false);

  const levelCounts = users.reduce((acc, user) => {
    acc[user.level] = (acc[user.level] || 0) + 1;
    return acc;
  }, {});

  const semesterCounts = users.reduce((acc, user) => {
    acc[user.semester] = (acc[user.semester] || 0) + 1;
    return acc;
  }, {});

  const levelData = Object.entries(levelCounts).map(([level, count]) => ({
    label: `${level} Level`,
    count,
  }));

  const semesterData = Object.entries(semesterCounts).map(([semester, count]) => ({
    label: `${semester} Semester`,
    count,
  }));

  return (
    <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center font-medium text-blue-700"
      >
        <span>User Insights</span>
        {open ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {open && (
        <div className="mt-6 space-y-6">
          <div className="text-sm text-gray-600 font-medium">
            Total Registered Students:{" "}
            <span className="text-blue-600 font-semibold">{users.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* By Level */}
            <div>
              <h3 className="text-gray-700 font-semibold mb-2">By Level</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={levelData}>
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
                {levelData.map(({ label, count }) => (
                  <span
                    key={label}
                    className="bg-blue-50 text-blue-700 border border-blue-100 rounded px-2 py-1"
                  >
                    {label}: {count}
                  </span>
                ))}
              </div>
            </div>

            {/* By Semester */}
            <div>
              <h3 className="text-gray-700 font-semibold mb-2">By Semester</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={semesterData}>
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
                {semesterData.map(({ label, count }) => (
                  <span
                    key={label}
                    className="bg-green-50 text-green-700 border border-green-100 rounded px-2 py-1"
                  >
                    {label}: {count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
