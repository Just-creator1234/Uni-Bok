"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateUser(data) {
  const session = await getServerSession(authOptions);
  const level = data.get("level");
  const semester = data.get("semester");
  const indexNo = data.get("indexNo");
  const hasRegistered = data.get("hasRegistered") === "true";

  const userId = session.user.id;

  const registeredUser = await prisma.user.update({
    where: { id: userId },
    data: {
      level,
      semester,
      indexNo,
      hasRegistered,
      hasCompletedQuestionnaire: true,
    },
  });

  const matchingCourses = await prisma.course.findMany({
    where: {
      level: registeredUser.level,
      semester: registeredUser.semester,
    },
  });

  console.log(matchingCourses, "UserCourses");

  await prisma.user.update({
    where: { id: userId },
    data: {
      courses: {
        connect: matchingCourses.map((course) => ({ id: course.id })),
      },
    },
  });
}

export async function getCourses() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }

  const userId = session.user.id;

  const userWithCourses = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      courses: {
        select: {
          id: true,
          code: true,
          title: true,
          level: true,
          semester: true,
          slug: true, // ✅ include this
        },
      },
    },
  });

  console.log(userWithCourses, "hhhhhhhhhhhhhhh");

  return userWithCourses?.courses || [];
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

export async function getUser() {
  const session = await getServerSession(authOptions);

  
  if (!session || !session.user?.id) {
    return null; 
  }

 
  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { hasCompletedQuestionnaire: true },
  });

  return user;
}
