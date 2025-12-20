// "use server";

// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";
// import prisma from "@/lib/prisma";
// import { redirect } from "next/navigation";

// export async function updateUser(data, userId) {
//   try {
//     const level = data.get("level");
//     const semester = data.get("semester");
//     const indexNo = data.get("indexNo");
//     const hasRegistered = data.get("hasRegistered") === "true";

//     // ✅ VALIDATION: Check for required fields
//     if (!level || !semester || !indexNo) {
//       return {
//         success: false,
//         error: "All fields are required: level, semester, and index number",
//       };
//     }

//     // Update user with questionnaire data
//     const registeredUser = await prisma.user.update({
//       where: { id: userId },
//       data: {
//         level,
//         semester,
//         indexNo,
//         hasRegistered,
//         hasCompletedQuestionnaire: true, // MARK AS COMPLETED
//       },
//     });

//     // Connect matching courses
//     const matchingCourses = await prisma.course.findMany({
//       where: {
//         level: registeredUser.level,
//         semester: registeredUser.semester,
//       },
//     });

//     if (matchingCourses.length > 0) {
//       await prisma.user.update({
//         where: { id: userId },
//         data: {
//           courses: {
//             connect: matchingCourses.map((course) => ({ id: course.id })),
//           },
//         },
//       });
//     }

//     // Return success instead of redirecting
//     return {
//       success: true,
//       message: "User updated successfully",
//     };
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return {
//       success: false,
//       error: "Failed to update user information",
//     };
//   }
// }

// export async function getCourses() {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     redirect("/signin");
//   }

//   const userId = session.user.id;

//   const userWithCourses = await prisma.user.findUnique({
//     where: { id: userId },
//     include: {
//       courses: {
//         select: {
//           id: true,
//           code: true,
//           title: true,
//           level: true,
//           semester: true,
//           slug: true, // ✅ include this
//         },
//       },
//     },
//   });

//   console.log(userWithCourses, "hhhhhhhhhhhhhhh");

//   return userWithCourses?.courses || [];
// }

// export async function getTopics(courseId) {
//   if (!courseId) throw new Error("Course ID is required");

//   const topics = await prisma.topic.findMany({
//     where: { courseId },
//     select: {
//       id: true,
//       title: true,
//       description: true,
//     },
//     orderBy: {
//       title: "asc",
//     },
//   });

//   return topics || {};
// }

// export async function getUser() {
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user?.id) {
//     return null;
//   }

//   const userId = session.user.id;

//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   return user;
// }

// app/actions/updateUser.js - KEEP ONLY THESE FUNCTIONS:

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getCourses() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return [];
  }

  const userId = session.user.id;

  // Get user's level and semester
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      hasCompletedQuestionnaire: true,
      level: true,
      semester: true,
    },
  });

  if (
    !user ||
    !user.hasCompletedQuestionnaire ||
    !user.level ||
    !user.semester
  ) {
    return [];
  }

  // Get courses matching user's level and semester
  const courses = await prisma.course.findMany({
    where: {
      level: user.level,
      semester: user.semester,
    },
    select: {
      id: true,
      code: true,
      title: true,
      level: true,
      semester: true,
      slug: true,
    },
    orderBy: {
      code: "asc",
    },
  });

  console.log(courses, "Courses for user level/semester");

  return courses;
}
export async function getTopics(courseId) {
  if (!courseId) throw new Error("Course ID is required");

  const topics = await prisma.topic.findMany({
    where: { courseId },
    select: {
      id: true,
      title: true,
      description: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  return topics || {};
}

// Optional: Keep getUser if needed elsewhere
export async function getUser() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return null;
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
}
