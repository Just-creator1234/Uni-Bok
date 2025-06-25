"use client";

import Link from "next/link";

export default function UserCourses({ courses }) {
  return (
    <div className="flex-2 flex flex-col bg-secondary text-heading ">
      <header className="py-8 px-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          📚 Your Registered Courses
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and access all materials for your enrolled courses
        </p>
      </header>

      {/* Main */}
      <main className="flex-grow px-6 pb-10">
        {courses.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No courses found for your current level and semester.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <li
                key={course.id}
                className="bg-white border border-muted rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-5"
              >
                <Link href={`/course/${course.slug}`} className="block h-full">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-primary">
                      {course.code}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      Level {course.level} • {course.semester} Semester
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
