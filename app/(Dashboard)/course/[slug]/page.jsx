// app/(courses)/course/[id]/page.js
import prisma from "@/lib/prisma";
import CourseHeader from "../CourseHeader";
import TopicSection from "../TopicSection";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CoursePage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }
  const paramed = await params;
  const { slug } = paramed;
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      topics: {
        include: {
          contents: true,
        },
      },
    },
  });

  if (!course)
    return <div className="text-center text-red-600">Course not found</div>;

  return (
    // <div className="max-w-4xl mx-auto p-6">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <CourseHeader course={course} />

      <div className="mt-8 space-y-6">
        {course.topics.map((topic) => (
          <TopicSection key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}
