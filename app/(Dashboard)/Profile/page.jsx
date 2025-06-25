import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StudentProfilePage from "./StudentProfilePage";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      level: true,
      semester: true,
      indexNo: true,
    },
  });

  const courses = await prisma.course.findMany({
    where: {
      level: student.level,
      semester: student.semester,
    },
    include: {
      topics: {
        include: {
          contents: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { code: "asc" },
  });

  return <StudentProfilePage student={student} courses={courses} />;
}
