import { PrismaClient } from "@prisma/client";
import { seedCategories } from "./categorySeed.js";
import { seedCourses } from "./courseSeed.js";


import { categories } from "./categoryData.js";
import { courses } from "./courseData.js";

const prisma = new PrismaClient();

async function main() {
  await seedCategories(prisma, categories);
  await seedCourses(prisma, courses);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
