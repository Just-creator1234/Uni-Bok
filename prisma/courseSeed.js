import slugify from "slugify";

export async function seedCourses(prisma, courses) {
  for (const group of courses) {
    for (const course of group.items) {
      const slug = slugify(course.title, { lower: true, strict: true });

      await prisma.course.upsert({
        where: { code: course.code },
        update: {},
        create: {
          code: course.code,
          title: course.title,
          slug,
          level: group.level,
          semester: group.semester,
        },
      });
    }
  }
  console.log("✅ Courses seeded with slugs.");
}
