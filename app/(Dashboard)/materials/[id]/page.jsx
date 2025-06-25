// app/(materials)/materials/[id]/page.js

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ContentViewer from "../ContentViewer";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function MaterialViewer({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }
  const { id } = await params;

  const content = await prisma.content.findUnique({
    where: { id: Number(id) },
    include: { topic: { include: { course: true } } },
  });

  if (!content) return notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
          {content.title}
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          {content.description}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          <span className="font-medium text-blue-700">Topic:</span>{" "}
          {content.topic.title} &nbsp;|&nbsp;
          <span className="font-medium text-blue-700">Course:</span>{" "}
          {content.topic.course.code}
        </p>
      </div>

      <div className="mt-6 border border-gray-200 rounded-lg bg-white shadow-sm p-4 sm:p-6 min-h-[60vh] sm:min-h-[85vh]">
        <ContentViewer format={content.format} fileUrl={content.fileUrl} />
      </div>
    </div>
  );
}
