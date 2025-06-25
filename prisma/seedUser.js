import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("password123", 10);

  for (let i = 0; i < 30; i++) {
    const hasRegistered = faker.datatype.boolean();

    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        role: "STUDENT",
        level: faker.helpers.arrayElement(["100", "200", "300", "400"]),
        semester: faker.helpers.arrayElement(["First", "Second"]),
        indexNo: `MB${faker.number.int({ min: 1000, max: 9999 })}`,
        emailVerified: new Date(),
        hasRegistered: hasRegistered,
      },
    });
  }

  console.log("✅ Seeding complete");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

main()
  .then(() => {
    console.log("✅ Seed complete");
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
