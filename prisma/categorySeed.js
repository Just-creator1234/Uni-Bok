// // prisma/seed.js
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// const categories = [
//   { id: "technology", name: "Technology", slug: "technology" },
//   { id: "design", name: "Design", slug: "design" },
//   { id: "business", name: "Business", slug: "business" },
//   { id: "marketing", name: "Marketing", slug: "marketing" },
//   { id: "development", name: "Development", slug: "development" },
//   { id: "ai-ml", name: "AI & ML", slug: "ai-ml" },

//   { id: "Annoucement", name: "Annoucement", slug: "Annoucement" },
// ];

// async function main() {
//   for (const category of categories) {
//     await prisma.category.upsert({
//       where: { id: category.id },
//       update: {},
//       create: {
//         id: category.id,
//         name: category.name,
//         slug: category.slug,
//       },
//     });
//   }
//   console.log("✅ Categories seeded successfully.");
// }

// main()
//   .catch((e) => {
//     console.error("❌ Error seeding categories:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

export async function seedCategories(prisma, categories) {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        slug: category.slug,
      },
      create: {
        id: category.id,
        name: category.name,
        slug: category.slug,
      },
    });
  }
  console.log("✅ Categories seeded successfully.");
}
