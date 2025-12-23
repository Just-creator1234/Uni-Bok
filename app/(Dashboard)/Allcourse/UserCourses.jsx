
// app/Allcourse/UserCourses.jsx
"use client";

import Link from "next/link";
import { GraduationCap, ArrowRight, BookOpen } from "lucide-react";
import { useSession } from "next-auth/react";

export default function UserCourses({ courses, userLevel, userSemester }) {
  const { data: session } = useSession();

  // Use props if available, otherwise fallback to session
  const level = userLevel || session?.user?.level;
  const semester = userSemester || session?.user?.semester;

  // Check if user has incomplete profile
  const hasIncompleteProfile = !level || !semester;

  return (
    <div className="flex-2 flex flex-col bg-secondary text-heading">
      <header className="py-8 px-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          📚 Your Registered Courses
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and access all materials for your enrolled courses
        </p>
      </header>

      {/* Profile Completion Banner */}
      {hasIncompleteProfile && (
        <div className="mx-6 mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-blue-700" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-blue-800">
                  Complete Your Profile
                </h3>
                <p className="text-sm text-blue-600">
                  Set your level and semester to see your registered courses
                </p>
              </div>
            </div>
            <Link
              href="/Profile"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors whitespace-nowrap"
            >
              Go to Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow px-6 pb-10">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {hasIncompleteProfile ? (
                <GraduationCap className="h-10 w-10 text-gray-400" />
              ) : (
                <BookOpen className="h-10 w-10 text-gray-400" />
              )}
            </div>

            {hasIncompleteProfile ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Complete Your Profile First
                </h3>
                <p className="text-gray-600 mb-6  mx-auto">
                  To see your registered courses, please set your academic level
                  and semester in your profile.
                </p>
                <Link
                  href="/Profile"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium transition-colors shadow-md"
                >
                  Complete Profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Courses Found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  No courses are currently available for Level {level},{" "}
                  {semester} Semester.
                  <br />
                  <span className="text-sm">
                    Please check back later or contact your department.
                  </span>
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            {!hasIncompleteProfile && (
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-600">
                  Showing courses for{" "}
                  <span className="font-semibold">Level {level}</span>,{" "}
                  <span className="font-semibold">{semester} Semester</span>
                </p>
              </div>
            )}

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <li
                  key={course.id}
                  className="bg-white border border-muted rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] p-5"
                >
                  <Link
                    href={`/course/${course.slug}`}
                    className="block h-full group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-primary group-hover:text-primary-dark">
                            {course.code}
                          </h2>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {course.title}
                          </p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            Level {course.level}
                          </span>
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">
                            {course.semester} Semester
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="text-xs text-gray-500 group-hover:text-primary transition-colors">
                          View course materials →
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
