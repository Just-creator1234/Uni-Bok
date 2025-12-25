
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
