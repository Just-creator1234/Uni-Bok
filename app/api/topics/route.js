// app/api/topics/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { courseId } = await req.json();
  if (!courseId)
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });

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

  return NextResponse.json({ topics });
}
