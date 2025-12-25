import ContentTable from "./ContentTable";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminMaterialsPage() {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/signin");
  }
  const topics = await prisma.topic.findMany({
    include: {
      course: true,
      contents: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const grouped = {};
  for (const topic of topics) {
    const { level, semester } = topic.course;
    if (!grouped[level]) grouped[level] = {};
    if (!grouped[level][semester]) grouped[level][semester] = [];

    const sortedContents = topic.contents.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt);
      const dateB = new Date(b.updatedAt || b.createdAt);
      return dateB - dateA;
    });

    for (const content of sortedContents) {
      grouped[level][semester].push({
        ...content,
        topicTitle: topic.title,
        course: topic.course,
      });
    }
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">
        All Uploaded Materials
      </h1>
      <ContentTable grouped={grouped} />
    </div>
  );
}
