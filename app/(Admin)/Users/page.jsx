// import prisma from "@/lib/prisma";
// import UserTable from "./UserTable";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { redirect } from "next/navigation";

// export default async function AdminUsersPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/AllCourse");
//   }

//   const users = await prisma.user.findMany({
//     where: {
//       role: { not: "SUPER_ADMIN" }, // Exclude SUPER_ADMIN
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   return <UserTable users={users} />;
// }



import prisma from "@/lib/prisma";
import UserTable from "./UserTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  // Allow both ADMIN and SUPER_ADMIN to access this page
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/AllCourse");
  }

  // Exclude SUPER_ADMIN from the list
  const users = await prisma.user.findMany({
    where: {
      role: { not: "SUPER_ADMIN" }
    },
    orderBy: { createdAt: "desc" },
  });

  // Pass current user's role to the client component
  return <UserTable users={users} currentUserRole={session.user.role} />;
}