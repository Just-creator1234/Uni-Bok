import Forms from "./Forms";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UploadPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/AllCourse");
  }
  const allCourses = await prisma.course.findMany();

  return <Forms allCourses={allCourses} />;
}
