// app/actions/getCategories.js
"use server";

import prisma from "@/lib/prisma";

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" }, // optional
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
