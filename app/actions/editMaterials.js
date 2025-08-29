"use server";

import prisma from "@/lib/prisma";

export async function deleteMaterial(id) {
  console.log("DeleteButton received id:", id);
  await prisma.content.delete({
    where: { id: Number(id) },
  });
}
