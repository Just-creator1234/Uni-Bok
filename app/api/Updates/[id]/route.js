// app/api/update/route.js
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

export async function POST(req, { params }) {
  const paramed = await params;
  try {
    const id = paramed.id;
    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const type = formData.get("type");
    const file = formData.get("file");
    let format = formData.get("format")?.toString().toLowerCase();

    let fileUrl;

    // ✅ File size limit: 10MB
    const MAX_FILE_SIZE = 100 * 1024 * 1024;

    if (file && file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File is too large. Maximum allowed size is 10MB." },
        { status: 413 }
      );
    }

    if (file && file.size > 0) {
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

      fileUrl = uploaded.secure_url;

      if (!format) {
        format = uploaded.format;
      }
    }

    const updated = await prisma.content.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(type && { type }),
        ...(fileUrl && { fileUrl }),
        ...(format && { format }),
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json(
      { error: "Failed to update material" },
      { status: 500 }
    );
  }
}
