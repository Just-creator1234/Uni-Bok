// app/api/upload/route.js
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const titleMap = {
  SLIDES: "Lecture",
  ASSIGNMENT: "Assignment",
  QUIZ: "Quiz",
AUDIO: "AUDIO",
  PAST_QUESTION: "Past Question",
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const courseId = formData.get("courseId");
    const type = formData.get("type");
    const userTitle = formData.get("title");
    const description = formData.get("contentDescription");
    const file = formData.get("file");

    let topicId = formData.get("topicId");
    const newTopic = formData.get("newTopic");
    const topicDescription = formData.get("topicDescription");

    if (!courseId || !type || !file || !userTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create topic if needed
    if (!topicId && newTopic) {
      const topic = await prisma.topic.create({
        data: {
          title: newTopic.toString(),
          description: topicDescription?.toString() || "",
          course: {
            connect: { id: courseId.toString() },
          },
        },
      });
      topicId = topic.id;
    }

    if (!topicId) {
      return NextResponse.json(
        { error: "No topic selected or created" },
        { status: 400 }
      );
    }

    const MAX_FILE_SIZE = 100 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
  return NextResponse.json(
    { error: "File is too large. Maximum allowed size is 10MB." },
    { status: 413 }
  );
}



if (file.size > MAX_FILE_SIZE) {
  return NextResponse.json(
    { error: "File is too large. Maximum allowed size is 10MB." },
    { status: 413 }
  );
}

    // Count to auto-generate title
    const count = await prisma.content.count({
      where: {
        topicId: Number(topicId),
        type: type.toString(),
      },
    });

    const typePrefix = titleMap[type.toString()];
    const autoTitle = `${typePrefix} ${count + 1} — ${userTitle}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: "materials",
            use_filename: true,
            unique_filename: false,
            filename_override: file.name,
            access_mode: "public",
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const format = formData.get("format")?.toString().toLowerCase();

    const saved = await prisma.content.create({
      data: {
        type: type.toString(),
        title: autoTitle,
        description: description?.toString() || "",
        fileUrl: uploaded.secure_url,
        format,
        topic: {
          connect: { id: Number(topicId) },
        },
      },
    });

    return NextResponse.json(
      { success: true, content: saved },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}



