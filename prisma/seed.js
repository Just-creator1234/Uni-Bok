// import { PrismaClient } from "@prisma/client";
// import { seedCategories } from "./categorySeed.js";
// import { seedCourses } from "./courseSeed.js";


// import { categories } from "./categoryData.js";
// import { courses } from "./courseData.js";

// const prisma = new PrismaClient();

// async function main() {
//   await seedCategories(prisma, categories);
//   await seedCourses(prisma, courses);
// }

// main()
//   .catch((e) => {
//     console.error("❌ Error seeding:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedCategories } from "./categorySeed.js";
import { seedCourses } from "./courseSeed.js";
import { categories } from "./categoryData.js";
import { courses } from "./courseData.js";

const prisma = new PrismaClient();

// SUPER_ADMIN details (hardcoded as requested)
const SUPER_ADMIN = {
  name: "Darlington Oppong Boateng",
  email: "darlingtonboateng18@gmail.com",
  level: "300",
  semester: "First",
  indexNo: "BS/MBB/23/0011"
};

async function seedSuperAdmin() {
  console.log("🌱 Checking/creating SUPER_ADMIN...");
  
  try {
    // Check if SUPER_ADMIN already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: SUPER_ADMIN.email },
          { role: "SUPER_ADMIN" }
        ]
      }
    });
    
    if (existingUser) {
      console.log(`⚠️  User already exists: ${existingUser.email}`);
      
      // Update role to SUPER_ADMIN if not already
      if (existingUser.role !== "SUPER_ADMIN") {
        console.log("🔄 Updating role to SUPER_ADMIN...");
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: "SUPER_ADMIN" }
        });
        console.log("✅ Role updated to SUPER_ADMIN");
      } else {
        console.log("✅ User is already SUPER_ADMIN");
      }
      
      // Update details if they don't match
      const needsUpdate = 
        existingUser.name !== SUPER_ADMIN.name ||
        existingUser.level !== SUPER_ADMIN.level ||
        existingUser.semester !== SUPER_ADMIN.semester ||
        existingUser.indexNo !== SUPER_ADMIN.indexNo;
      
      if (needsUpdate) {
        console.log("🔄 Updating SUPER_ADMIN details...");
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: SUPER_ADMIN.name,
            level: SUPER_ADMIN.level,
            semester: SUPER_ADMIN.semester,
            indexNo: SUPER_ADMIN.indexNo
          }
        });
        console.log("✅ Details updated");
      }
      
      return existingUser;
    }
    
    // Generate unique slug
    const baseSlug = SUPER_ADMIN.email.split("@")[0].toLowerCase()
      .replace(/[^a-z0-9]/g, "-");
    
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.user.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }
    
    // Create initial password (CHANGE THIS AFTER FIRST LOGIN!)
    const initialPassword = "ChangeMe123!";
    const hashedPassword = await bcrypt.hash(initialPassword, 12);
    
    // Create SUPER_ADMIN
    const superAdmin = await prisma.user.create({
      data: {
        name: SUPER_ADMIN.name,
        email: SUPER_ADMIN.email.toLowerCase(),
        password: hashedPassword,
        slug: slug,
        role: "SUPER_ADMIN",
        level: SUPER_ADMIN.level,
        semester: SUPER_ADMIN.semester,
        indexNo: SUPER_ADMIN.indexNo,
        emailVerified: true,
        hasRegistered: true,
        hasCompletedQuestionnaire: false,
        image: null
      }
    });
    
    console.log("✅ SUPER_ADMIN created successfully!");
    console.log("📋 Details:");
    console.log(`   Name: ${superAdmin.name}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Role: ${superAdmin.role}`);
    console.log(`   Level: ${superAdmin.level}`);
    console.log(`   Semester: ${superAdmin.semester}`);
    console.log(`   Index No: ${superAdmin.indexNo}`);
    console.log(`   Initial Password: ${initialPassword}`);
    console.log("\n⚠️  SECURITY WARNING:");
    console.log("   Change the password immediately after first login!");
    console.log("   Store the new password securely.");
    
    return superAdmin;
  } catch (error) {
    console.error("❌ Error seeding SUPER_ADMIN:", error);
    throw error;
  }
}

async function main() {
  console.log("🚀 Starting database seeding...");
  
  // 1. First seed SUPER_ADMIN
  await seedSuperAdmin();
  
  // 2. Seed categories and courses
  console.log("\n📚 Seeding categories and courses...");
  await seedCategories(prisma, categories);
  await seedCourses(prisma, courses);
  
  console.log("\n✅ All seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });