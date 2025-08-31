// lib/utils.js
import slugifyPackage from "slugify";

export function createSlug(text) {
  return slugifyPackage(text, {
    lower: true,
    strict: true,
    trim: true,
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
  });
}

export async function generateUniqueSlug(baseSlug, prisma) {
  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const existingUser = await prisma.user.findUnique({
      where: { slug },
    });

    if (!existingUser) {
      isUnique = true;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
}
