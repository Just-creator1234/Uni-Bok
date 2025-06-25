import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

const courses = [
  {
    level: "100",
    semester: "First",
    items: [
      { code: "BIO101", title: "Diversity of Living Organisms" },
      { code: "CHE105A", title: "Introduction to Basic Organic Chemistry I" },
      { code: "CMS107", title: "Communicative Skills I" },
      { code: "ILT101", title: "Information Literacy Skills" },
      { code: "PHY101", title: "General Physics I (Theory)" },
      { code: "PHY103", title: "General Physics I (Practical)" },
    ],
  },
  {
    level: "100",
    semester: "Second",
    items: [
      { code: "BIO102", title: "Basic Cytology and Genetics" },
      { code: "BIO103", title: "Data Collection and Analysis" },
      { code: "CHE104", title: "Introductory Practical Organic Chemistry" },
      { code: "CHE105B", title: "Introduction to Organic Chemistry" },
      { code: "CMS108", title: "Communicative Skills II" },
      { code: "ITS101", title: "Information Technology Skills" },
      { code: "PHY102", title: "General Physics II (Theory)" },
      { code: "PHY104", title: "General Physics II (Practical)" },
    ],
  },
  {
    level: "200",
    semester: "First",
    items: [
      { code: "BIO202", title: "Cell and Tissue Organisation" },
      {
        code: "BIO203",
        title: "Phylogeny and Morphology of Invertebrates and Vertebrates",
      },
      { code: "BIO204", title: "Morphology and Anatomy of Higher Plants" },
      {
        code: "BIO205A",
        title: "Introduction to Biodiversity: Systematics and Taxonomy",
      },
      { code: "BIO210", title: "Cryptogams" },
      { code: "CHE203", title: "Physical Chemistry I" },
      { code: "CHE207", title: "Practical Physical Chemistry" },
      { code: "MBB201", title: "Fundamentals of Molecular Biology" },
    ],
  },
  {
    level: "200",
    semester: "Second",
    items: [
      { code: "BIO207", title: "Principles of Ecology" },
      { code: "BIO208", title: "Population Genetics and Evolution" },
      { code: "BIO209A", title: "Introductory Microbiology and Parasitology" },
      { code: "BIO211", title: "Plant Physiology" },
      { code: "BIO212", title: "Mammalian Anatomy and Physiology" },
      { code: "CHE208", title: "Physical Chemistry II" },
      { code: "MBB202", title: "Developmental Biology" },
      { code: "PHL205", title: "Critical Thinking and Practical Reasoning" },
    ],
  },
  {
    level: "300",
    semester: "First",
    items: [
      { code: "BIO315", title: "Basic Computing for Biologists" },
      { code: "MBB303", title: "General Virology" },
      { code: "MBB305", title: "Plant Physiological Ecology" },
      { code: "MBB311", title: "Molecular Genetics I" },
      { code: "MBB313", title: "Microbiology" },
      { code: "MBB315", title: "Laboratory Procedures in Microbiology" },
    ],
  },
  {
    level: "300",
    semester: "Second",
    items: [
      { code: "BIO312", title: "Biostatistics" },
      { code: "MBB302", title: "Microbial Genetics" },
      { code: "MBB306", title: "Introduction to Biotechnology and Biosafety" },
      { code: "MBB308", title: "Laboratory Procedures in Molecular Biology" },
      { code: "MBB310", title: "Biochemistry of Carbohydrates and Lipids" },
      { code: "MBB312", title: "Protein Chemistry" },
      { code: "MBB399", title: "Research Methods in Biology" },
      { code: "ENTR300", title: "Introduction to Entrepreneurship" },
    ],
  },
  {
    level: "400",
    semester: "First",
    items: [
      { code: "MBB411", title: "Bioinformatics" },
      { code: "MBB419", title: "Cell Physiology and Biochemistry" },
      { code: "MBB421", title: "Tissue Culture Technology" },
      { code: "MBB423", title: "Recombinant DNA Technology" },
      { code: "MBB425", title: "Molecular Genetics II" },
      { code: "MBB427", title: "Industrial Attachment" },
    ],
  },
  {
    level: "400",
    semester: "Second",
    items: [
      {
        code: "MBB408",
        title: "Molecular Marker Techniques in Plant and Animal Improvement",
      },
      { code: "MBB412", title: "Food and Environmental Biosafety" },
      { code: "MBB414", title: "Socio-Economic Concerns of Biosafety" },
      { code: "MBB416", title: "Applications of Biosafety" },
      { code: "MBB418", title: "Medical Biotechnology" },
      { code: "MBB420", title: "Plant Pathology" },
      { code: "MBB499", title: "Research Project" },
    ],
  },
];

async function main() {
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
}

main()
  .then(() => {
    console.log("✅ All courses seeded with slugs.");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  });
