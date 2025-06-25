// app/actions/updateStudent.js
"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateStudentProfile({ id, name, level, semester }) {
  if (!id || !name || !level || !semester) {
    throw new Error("Missing required fields");
  }

  // Step 1: Update user basic info
  await prisma.user.update({
    where: { id },
    data: {
      name,
      level,
      semester,
    },
  });

  // Step 2: Fetch matching courses
  const matchedCourses = await prisma.course.findMany({
    where: {
      level,
      semester,
    },
    select: { id: true },
  });

  // Step 3: Update the user's enrolledCourses relation
  await prisma.user.update({
    where: { id },
    data: {
      courses: {
        set: matchedCourses.map((course) => ({ id: course.id })),
      },
    },
  });
}

export async function updateUserProfile(id, data) {
  if (!id || !data.name || !data.level || !data.semester) {
    throw new Error("Missing required fields");
  }

  // Fetch matching courses
  const matchedCourses = await prisma.course.findMany({
    where: {
      level: data.level,
      semester: data.semester,
    },
    select: { id: true },
  });

  await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      indexNo: data.indexNo,
      level: data.level,
      semester: data.semester,
      courses: {
        set: matchedCourses.map((course) => ({ id: course.id })),
      },
    },
  });
}

export async function deleteStudentAccount() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) throw new Error("Not authenticated");

  await prisma.user.delete({
    where: { id: userId },
  });

  // Can't call signOut here, so redirect to a page where client will handle it
  redirect("/signout");
}

export async function deleteStudent(userId) {
  if (!userId) throw new Error("Missing user ID");

  await prisma.user.delete({
    where: { id: userId },
  });
}
